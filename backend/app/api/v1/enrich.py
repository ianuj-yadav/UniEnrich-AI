from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db, AsyncSessionLocal
from app.db.models import Batch
from app.schemas.schemas import StartEnrichmentRequest, BatchSummary
from app.services.pipeline import enrichment_pipeline

router = APIRouter()

async def run_pipeline_task(batch_id: str):
    async with AsyncSessionLocal() as session:
        await enrichment_pipeline.process_batch(batch_id, session)

@router.post("/enrich/{batch_id}")
async def start_enrichment(
    batch_id: str,
    background_tasks: BackgroundTasks,
    request: StartEnrichmentRequest = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    if batch.status == "PROCESSING":
        return {"status": "ALREADY_PROCESSING", "batch_id": batch_id, "message": "Batch is currently being processed."}

    background_tasks.add_task(run_pipeline_task, batch_id)
    
    return {
        "status": "STARTED",
        "batch_id": batch_id,
        "message": f"Enrichment pipeline initiated for batch '{batch.filename}'."
    }

@router.get("/enrich/progress/{batch_id}")
async def get_enrichment_progress(
    batch_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Batch).where(Batch.id == batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    return {
        "batch_id": batch.id,
        "filename": batch.filename,
        "status": batch.status,
        "progress_percentage": batch.progress_percentage,
        "current_step": batch.current_step,
        "processed_records": batch.processed_records,
        "total_records": batch.total_records,
        "logs": batch.logs or []
    }

@router.get("/batches", response_model=List[BatchSummary])
async def list_batches(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Batch).order_by(Batch.uploaded_at.desc()).limit(limit))
    batches = result.scalars().all()
    return batches
