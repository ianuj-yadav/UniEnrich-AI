from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import EnrichedProduct
from app.services.localization import localization_service

router = APIRouter()

class LocalizeRequest(BaseModel):
    product_id: str
    target_language: str = "es" # es, de, fr

@router.post("/localize")
async def localize_product_copy(
    req: LocalizeRequest,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(EnrichedProduct).where(EnrichedProduct.id == req.product_id))
    ep = result.scalar_one_or_none()
    if not ep:
        raise HTTPException(status_code=404, detail="Product not found.")

    payload = {
        "product_title": ep.product_title,
        "mobile_description": ep.mobile_description,
        "long_description": ep.long_description,
        "attributes": ep.extracted_attributes or {}
    }

    localized = await localization_service.localize_product(payload, req.target_language)
    return {
        "status": "SUCCESS",
        "product_id": ep.id,
        "target_language": req.target_language,
        "localized_data": localized
    }
