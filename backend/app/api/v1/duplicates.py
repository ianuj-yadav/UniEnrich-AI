from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Batch, EnrichedProduct, RawProduct
from app.services.duplicate_resolver import duplicate_resolver

router = APIRouter()

class MergeDuplicatesRequest(BaseModel):
    batch_id: str
    primary_product_id: str
    duplicate_product_ids: List[str]

@router.get("/duplicates/{batch_id}")
async def get_duplicate_clusters(
    batch_id: str,
    threshold: float = Query(0.75, ge=0.5, le=1.0),
    db: AsyncSession = Depends(get_db)
):
    prods_query = (
        select(EnrichedProduct, RawProduct)
        .join(RawProduct, EnrichedProduct.raw_product_id == RawProduct.id)
        .where(EnrichedProduct.batch_id == batch_id)
    )
    result = await db.execute(prods_query)
    rows = result.all()

    items = []
    for ep, raw in rows:
        items.append({
            "id": ep.id,
            "raw_sku": raw.raw_sku,
            "canonical_sku": ep.canonical_sku,
            "product_title": ep.product_title,
            "raw_description": raw.raw_description,
            "resolved_brand": ep.resolved_brand,
            "category": ep.category,
            "subcategory": ep.subcategory,
            "extracted_attributes": ep.extracted_attributes or {},
            "confidence_score": ep.confidence_score
        })

    clusters = duplicate_resolver.find_duplicate_clusters(items, threshold)

    return {
        "batch_id": batch_id,
        "threshold": threshold,
        "total_clusters_found": len(clusters),
        "total_duplicate_items": sum(len(c["duplicate_items"]) for c in clusters),
        "clusters": clusters
    }

@router.post("/duplicates/merge")
async def merge_duplicate_records(
    req: MergeDuplicatesRequest,
    db: AsyncSession = Depends(get_db)
):
    primary_res = await db.execute(select(EnrichedProduct).where(EnrichedProduct.id == req.primary_product_id))
    primary = primary_res.scalar_one_or_none()
    if not primary:
        raise HTTPException(status_code=404, detail="Primary product not found.")

    dup_res = await db.execute(select(EnrichedProduct).where(EnrichedProduct.id.in_(req.duplicate_product_ids)))
    duplicates = dup_res.scalars().all()

    dup_dicts = []
    for d in duplicates:
        dup_dicts.append({
            "canonical_sku": d.canonical_sku,
            "extracted_attributes": d.extracted_attributes or {}
        })

    merged_data = duplicate_resolver.merge_records(
        {
            "canonical_sku": primary.canonical_sku,
            "extracted_attributes": primary.extracted_attributes or {}
        },
        dup_dicts
    )

    primary.extracted_attributes = merged_data["extracted_attributes"]
    primary.confidence_score = 1.0  # Verified merge
    primary.review_status = "REVIEWED_APPROVED"

    # Mark duplicate products as rejected/merged
    for d in duplicates:
        d.review_status = "REJECTED"

    await db.commit()

    return {
        "status": "SUCCESS",
        "primary_id": primary.id,
        "merged_sku": primary.canonical_sku,
        "merged_attributes": primary.extracted_attributes,
        "duplicates_consolidated": len(duplicates),
        "message": f"Successfully consolidated {len(duplicates)} duplicate records into canonical master '{primary.canonical_sku}'."
    }
