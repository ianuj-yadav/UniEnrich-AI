from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.copilot_service import copilot_service

router = APIRouter()

class CopilotQueryRequest(BaseModel):
    batch_id: str
    prompt: str

class CopilotBulkEditRequest(BaseModel):
    product_ids: List[str]
    attribute_name: str
    new_value: str

@router.post("/copilot/query")
async def execute_copilot_query(
    req: CopilotQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await copilot_service.parse_and_execute_query(req.prompt, req.batch_id, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/copilot/apply-bulk-edit")
async def apply_copilot_bulk_edit(
    req: CopilotBulkEditRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await copilot_service.execute_bulk_edit(
            req.product_ids,
            req.attribute_name,
            req.new_value,
            db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
