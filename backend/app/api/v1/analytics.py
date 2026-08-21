from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Batch, RawProduct, EnrichedProduct
from app.schemas.schemas import AnalyticsOverview

router = APIRouter()

@router.get("/analytics/{batch_id}", response_model=AnalyticsOverview)
async def get_batch_analytics(
    batch_id: str,
    db: AsyncSession = Depends(get_db)
):
    batch_result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = batch_result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    raw_result = await db.execute(select(RawProduct).where(RawProduct.batch_id == batch_id))
    raw_products = raw_result.scalars().all()

    enriched_result = await db.execute(select(EnrichedProduct).where(EnrichedProduct.batch_id == batch_id))
    enriched_products = enriched_result.scalars().all()

    total = batch.total_records
    processed = len(enriched_products)

    # Status counts
    needs_review = sum(1 for ep in enriched_products if ep.review_status == "NEEDS_REVIEW")
    approved = sum(1 for ep in enriched_products if ep.review_status in ["AUTO_APPROVED", "REVIEWED_APPROVED"])
    accuracy = round((approved / total * 100), 1) if total > 0 else 0.0

    # Brand distribution
    brands = [ep.resolved_brand or "Unbranded" for ep in enriched_products]
    brand_counts = Counter(brands).most_common(10)
    brand_dist = [{"brand": b, "count": c} for b, c in brand_counts]

    # Category distribution
    categories = [ep.category or "Uncategorized" for ep in enriched_products]
    cat_counts = Counter(categories).most_common(8)
    cat_dist = [{"category": c, "count": cnt} for c, cnt in cat_counts]

    # Confidence histogram bins (0-50, 50-70, 70-85, 85-100)
    bins = {"<50%": 0, "50-70% (Review)": 0, "70-85%": 0, "85-100%": 0}
    for ep in enriched_products:
        score = ep.confidence_score * 100
        if score < 50:
            bins["<50%"] += 1
        elif score < 70:
            bins["50-70% (Review)"] += 1
        elif score < 85:
            bins["70-85%"] += 1
        else:
            bins["85-100%"] += 1
    conf_histogram = [{"range": k, "count": v} for k, v in bins.items()]

    # Completeness delta (before vs after)
    raw_missing_brands = sum(1 for r in raw_products if not r.raw_brand or r.raw_brand.lower() in ["-- unbranded --", "n/a", "none"])
    enriched_missing_brands = sum(1 for ep in enriched_products if not ep.resolved_brand)
    
    raw_has_desc = sum(1 for r in raw_products if r.raw_description)
    enriched_has_title = sum(1 for ep in enriched_products if ep.product_title)
    
    raw_has_cat = sum(1 for r in raw_products if r.raw_category)
    enriched_has_cat = sum(1 for ep in enriched_products if ep.category)

    completeness_delta = {
        "brand_coverage_before": round(((total - raw_missing_brands) / total * 100), 1) if total > 0 else 0,
        "brand_coverage_after": round(((total - enriched_missing_brands) / total * 100), 1) if total > 0 else 0,
        "category_coverage_before": round((raw_has_cat / total * 100), 1) if total > 0 else 0,
        "category_coverage_after": round((enriched_has_cat / total * 100), 1) if total > 0 else 0,
        "title_standardization_gain": round((enriched_has_title / total * 100), 1) if total > 0 else 0
    }

    # Top extracted attributes
    all_attr_keys = []
    for ep in enriched_products:
        if ep.extracted_attributes:
            all_attr_keys.extend(ep.extracted_attributes.keys())
    top_attrs = [{"attribute": k, "count": v} for k, v in Counter(all_attr_keys).most_common(8)]

    return AnalyticsOverview(
        total_products=total,
        processed_products=processed,
        accuracy_percentage=accuracy,
        needs_review_count=needs_review,
        auto_approved_count=approved,
        duplicate_count=batch.duplicate_records,
        brand_distribution=brand_dist,
        category_distribution=cat_dist,
        confidence_histogram=conf_histogram,
        completeness_delta=completeness_delta,
        top_extracted_attributes=top_attrs
    )
