from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.db.session import get_db
from app.db.models import Batch, RawProduct, EnrichedProduct
from app.schemas.schemas import PaginatedProductsResponse, EnrichedProductItem, SplitComparisonResponse

router = APIRouter()

@router.get("/products/{batch_id}", response_model=PaginatedProductsResponse)
async def get_batch_products(
    batch_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    status: Optional[str] = Query(None), # NEEDS_REVIEW, AUTO_APPROVED, REVIEWED_APPROVED, REJECTED
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    # Verify batch
    batch_result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = batch_result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    # Base query joined with raw_products
    query = (
        select(EnrichedProduct, RawProduct)
        .join(RawProduct, EnrichedProduct.raw_product_id == RawProduct.id)
        .where(EnrichedProduct.batch_id == batch_id)
    )

    if status and status != "ALL":
        query = query.where(EnrichedProduct.review_status == status)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.where(
            (EnrichedProduct.product_title.ilike(term)) |
            (EnrichedProduct.resolved_brand.ilike(term)) |
            (EnrichedProduct.canonical_sku.ilike(term)) |
            (RawProduct.raw_description.ilike(term))
        )

    # Count total matching
    count_query = select(func.count()).select_from(query.subquery())
    total_count = (await db.execute(count_query)).scalar() or 0

    # Counts by status
    review_count_q = select(func.count()).select_from(
        select(EnrichedProduct).where(EnrichedProduct.batch_id == batch_id, EnrichedProduct.review_status == "NEEDS_REVIEW").subquery()
    )
    needs_review_count = (await db.execute(review_count_q)).scalar() or 0

    approved_count_q = select(func.count()).select_from(
        select(EnrichedProduct).where(EnrichedProduct.batch_id == batch_id, EnrichedProduct.review_status.in_(["AUTO_APPROVED", "REVIEWED_APPROVED"])).subquery()
    )
    approved_count = (await db.execute(approved_count_q)).scalar() or 0

    # Paginate
    offset = (page - 1) * limit
    results = await db.execute(query.offset(offset).limit(limit))
    rows = results.all()

    items = []
    for ep, raw in rows:
        item = EnrichedProductItem(
            id=ep.id,
            raw_product_id=raw.id,
            raw_sku=raw.raw_sku,
            raw_brand=raw.raw_brand,
            raw_description=raw.raw_description,
            canonical_sku=ep.canonical_sku,
            resolved_brand=ep.resolved_brand,
            resolved_manufacturer=ep.resolved_manufacturer,
            category=ep.category,
            subcategory=ep.subcategory,
            product_family=ep.product_family,
            unspsc_code=ep.unspsc_code,
            product_title=ep.product_title,
            mobile_description=ep.mobile_description,
            long_description=ep.long_description,
            extracted_attributes=ep.extracted_attributes or {},
            confidence_score=ep.confidence_score,
            confidence_breakdown=ep.confidence_breakdown or {},
            review_status=ep.review_status,
            is_modified_by_human=ep.is_modified_by_human,
            has_error=raw.has_error,
            is_duplicate=raw.is_duplicate
        )
        items.append(item)

    accuracy_rate = round((approved_count / batch.total_records) * 100, 1) if batch.total_records > 0 else 0.0

    return PaginatedProductsResponse(
        items=items,
        total=total_count,
        page=page,
        limit=limit,
        needs_review_count=needs_review_count,
        auto_approved_count=approved_count,
        accuracy_rate=accuracy_rate
    )

@router.get("/products/{product_id}/compare", response_model=SplitComparisonResponse)
async def get_product_comparison(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(EnrichedProduct, RawProduct)
        .join(RawProduct, EnrichedProduct.raw_product_id == RawProduct.id)
        .where(EnrichedProduct.id == product_id)
    )
    result = await db.execute(query)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found.")

    ep, raw = row

    raw_rec = {
        "sku": raw.raw_sku,
        "brand": raw.raw_brand,
        "description": raw.raw_description,
        "category": raw.raw_category,
        "raw_attributes": raw.raw_data
    }

    enriched_rec = {
        "sku": ep.canonical_sku,
        "title": ep.product_title,
        "brand": ep.resolved_brand,
        "manufacturer": ep.resolved_manufacturer,
        "category": ep.category,
        "subcategory": ep.subcategory,
        "unspsc": ep.unspsc_code,
        "attributes": ep.extracted_attributes,
        "mobile_description": ep.mobile_description,
        "long_description": ep.long_description
    }

    changed_fields = []
    if raw.raw_brand != ep.resolved_brand:
        changed_fields.append("Brand")
    if not raw.raw_category or raw.raw_category != ep.category:
        changed_fields.append("Category / Taxonomy")
    if ep.extracted_attributes:
        changed_fields.append("Technical Attributes")
    if ep.product_title != raw.raw_description:
        changed_fields.append("Product Title")
    changed_fields.append("Mobile & Long Descriptions")

    return SplitComparisonResponse(
        product_id=ep.id,
        raw_record=raw_rec,
        enriched_record=enriched_rec,
        changed_fields=changed_fields,
        confidence_score=ep.confidence_score,
        confidence_breakdown=ep.confidence_breakdown or {},
        review_status=ep.review_status
    )
