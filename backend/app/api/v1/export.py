from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Batch, EnrichedProduct, RawProduct
from app.services.exporter import catalog_exporter

router = APIRouter()

@router.get("/export/{batch_id}")
async def export_catalog(
    batch_id: str,
    format: str = Query("csv", pattern="^(csv|xlsx|json)$"),
    status: str = Query("ALL"),
    db: AsyncSession = Depends(get_db)
):
    batch_result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = batch_result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    query = (
        select(EnrichedProduct, RawProduct)
        .join(RawProduct, EnrichedProduct.raw_product_id == RawProduct.id)
        .where(EnrichedProduct.batch_id == batch_id)
    )

    if status != "ALL":
        query = query.where(EnrichedProduct.review_status == status)

    results = await db.execute(query)
    rows = results.all()

    items = []
    for ep, raw in rows:
        items.append({
            "raw_sku": raw.raw_sku,
            "canonical_sku": ep.canonical_sku,
            "product_title": ep.product_title,
            "resolved_brand": ep.resolved_brand,
            "resolved_manufacturer": ep.resolved_manufacturer,
            "category": ep.category,
            "subcategory": ep.subcategory,
            "unspsc_code": ep.unspsc_code,
            "extracted_attributes": ep.extracted_attributes or {},
            "mobile_description": ep.mobile_description,
            "long_description": ep.long_description,
            "confidence_score": ep.confidence_score,
            "review_status": ep.review_status
        })

    filename_base = f"UniEnrich_Export_{batch.filename.rsplit('.', 1)[0]}"

    if format == "csv":
        buf = catalog_exporter.export_csv(items)
        media_type = "text/csv"
        ext = "csv"
    elif format == "xlsx":
        buf = catalog_exporter.export_excel(items)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ext = "xlsx"
    else:
        buf = catalog_exporter.export_json(items)
        media_type = "application/json"
        ext = "json"

    return StreamingResponse(
        buf,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename_base}.{ext}"'}
    )
