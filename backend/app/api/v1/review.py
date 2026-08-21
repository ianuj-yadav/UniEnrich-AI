from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import EnrichedProduct, ReviewLog
from app.schemas.schemas import ReviewActionRequest, BulkReviewActionRequest

router = APIRouter()

@router.post("/review/submit")
async def submit_review(
    req: ReviewActionRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(EnrichedProduct).where(EnrichedProduct.id == req.product_id))
    ep = result.scalar_one_or_none()
    if not ep:
        raise HTTPException(status_code=404, detail="Enriched product not found.")

    if req.action == "ACCEPT":
        ep.review_status = "REVIEWED_APPROVED"
        ep.confidence_score = 1.0
        log = ReviewLog(
            enriched_product_id=ep.id,
            field_name="ALL",
            old_value="NEEDS_REVIEW",
            new_value="REVIEWED_APPROVED",
            reviewer=req.reviewer,
            action="ACCEPT"
        )
        db.add(log)

    elif req.action == "REJECT":
        ep.review_status = "REJECTED"
        log = ReviewLog(
            enriched_product_id=ep.id,
            field_name="ALL",
            old_value=ep.review_status,
            new_value="REJECTED",
            reviewer=req.reviewer,
            action="REJECT"
        )
        db.add(log)

    elif req.action == "EDIT" and req.edits:
        ep.is_modified_by_human = True
        ep.review_status = "REVIEWED_APPROVED"
        ep.confidence_score = 1.0  # Human verified

        for field, new_val in req.edits.items():
            old_val = getattr(ep, field, None)
            if hasattr(ep, field):
                setattr(ep, field, new_val)
                log = ReviewLog(
                    enriched_product_id=ep.id,
                    field_name=field,
                    old_value=str(old_val),
                    new_value=str(new_val),
                    reviewer=req.reviewer,
                    action="EDIT"
                )
                db.add(log)
            elif field.startswith("attr_"):
                # Attribute key update
                attr_name = field.replace("attr_", "")
                current_attrs = dict(ep.extracted_attributes or {})
                current_attrs[attr_name] = new_val
                ep.extracted_attributes = current_attrs
                log = ReviewLog(
                    enriched_product_id=ep.id,
                    field_name=f"attribute:{attr_name}",
                    old_value=str(old_val),
                    new_value=str(new_val),
                    reviewer=req.reviewer,
                    action="EDIT"
                )
                db.add(log)

    await db.commit()
    return {
        "status": "SUCCESS",
        "product_id": ep.id,
        "new_status": ep.review_status,
        "confidence_score": ep.confidence_score,
        "message": f"Review action '{req.action}' applied successfully."
    }

@router.post("/review/bulk-action")
async def bulk_review_action(
    req: BulkReviewActionRequest,
    db: AsyncSession = Depends(get_db)
):
    if not req.product_ids:
        raise HTTPException(status_code=400, detail="No product IDs provided.")

    query = select(EnrichedProduct).where(EnrichedProduct.id.in_(req.product_ids))
    results = await db.execute(query)
    products = results.scalars().all()

    target_status = "REVIEWED_APPROVED" if req.action == "ACCEPT_ALL" else "REJECTED"
    new_confidence = 1.0 if req.action == "ACCEPT_ALL" else 0.0

    for ep in products:
        ep.review_status = target_status
        ep.confidence_score = new_confidence
        log = ReviewLog(
            enriched_product_id=ep.id,
            field_name="BULK_ACTION",
            old_value="NEEDS_REVIEW",
            new_value=target_status,
            reviewer=req.reviewer,
            action=req.action
        )
        db.add(log)

    await db.commit()
    return {
        "status": "SUCCESS",
        "count": len(products),
        "target_status": target_status,
        "message": f"Updated {len(products)} products to '{target_status}'."
    }
