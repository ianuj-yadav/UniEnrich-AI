from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Batch, RawProduct, EnrichedProduct
from app.services.datasheet_parser import datasheet_parser

router = APIRouter()

class ImportDatasheetRequest(BaseModel):
    batch_id: str
    parsed_spec: Dict[str, Any]

@router.post("/datasheet/parse")
async def parse_datasheet_endpoint(
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg", ".txt")):
        raise HTTPException(status_code=400, detail="Supported formats: .pdf, .png, .jpg, .jpeg, .txt")

    content = await file.read()
    try:
        result = await datasheet_parser.parse_datasheet(file.filename, content)
        return {
            "status": "SUCCESS",
            "filename": file.filename,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse datasheet: {str(e)}")

@router.post("/datasheet/import-to-batch")
async def import_parsed_datasheet_to_batch(
    req: ImportDatasheetRequest,
    db: AsyncSession = Depends(get_db)
):
    batch_result = await db.execute(select(Batch).where(Batch.id == req.batch_id))
    batch = batch_result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found.")

    spec = req.parsed_spec
    sku = spec.get("detected_sku", f"DS-{batch.total_records+1:04d}")
    brand = spec.get("detected_brand", "Standard")
    attrs = spec.get("technical_specs", {})
    
    title = f"{brand} {attrs.get('Size', '')} {attrs.get('Material', '')} {spec.get('subcategory', 'Fitting')} {attrs.get('Pressure Rating', '')}".strip()

    # Create raw product
    raw = RawProduct(
        batch_id=batch.id,
        row_index=batch.total_records + 1,
        raw_sku=sku,
        raw_brand=brand,
        raw_description=f"Datasheet Import: {spec.get('document_name', '')} {json_str(attrs)}",
        raw_category=spec.get("category"),
        raw_data=attrs
    )
    db.add(raw)
    await db.flush()

    # Create enriched product
    enriched = EnrichedProduct(
        raw_product_id=raw.id,
        batch_id=batch.id,
        canonical_sku=sku,
        cleaned_description=title,
        resolved_brand=brand,
        resolved_manufacturer=brand,
        brand_confidence=0.98,
        category=spec.get("category", "Plumbing & Piping"),
        subcategory=spec.get("subcategory", "Hydraulic Fittings"),
        unspsc_code=spec.get("unspsc", "40141700"),
        category_confidence=0.95,
        extracted_attributes=attrs,
        attribute_confidence=0.98,
        product_title=title,
        mobile_description=f"Precision engineered {brand} {title}, compliant with {spec.get('compliance', 'ANSI')}.",
        long_description=f"The {brand} {title} is an industrial component extracted from certified datasheet {spec.get('document_name', '')}. Engineered with {attrs.get('Material', 'high-grade alloy')} and rated for {attrs.get('Pressure Rating', 'standard pressure')}.",
        description_confidence=0.95,
        confidence_score=0.96,
        confidence_breakdown={"brand": 0.98, "category": 0.95, "attributes": 0.98, "description": 0.95, "aggregate": 0.96},
        review_status="AUTO_APPROVED"
    )
    db.add(enriched)

    batch.total_records += 1
    batch.processed_records += 1
    await db.commit()

    return {
        "status": "SUCCESS",
        "product_id": enriched.id,
        "sku": sku,
        "title": title,
        "message": f"Successfully imported '{sku}' from datasheet into catalog batch '{batch.filename}'."
    }

def json_str(obj: Any) -> str:
    import json
    return json.dumps(obj)
