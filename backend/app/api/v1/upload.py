import io
import pandas as pd
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db.models import Batch, RawProduct
from app.schemas.schemas import UploadResponse
from app.services.cleaner import cleaner_engine

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_catalog_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith((".csv", ".xlsx", ".xls", ".tsv")):
        raise HTTPException(status_code=400, detail="Invalid file format. Supported: .csv, .xlsx, .xls, .tsv")

    contents = await file.read()
    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(".tsv"):
            df = pd.read_csv(io.BytesIO(contents), sep="\t")
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse file: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded file contains no rows.")

    # Standardize column header matching
    columns = list(df.columns)
    sku_col = next((c for c in columns if any(k in c.lower() for k in ["sku", "item_no", "part_no", "part#", "code"])), None)
    brand_col = next((c for c in columns if any(k in c.lower() for k in ["brand", "manufacturer", "mfr"])), None)
    desc_col = next((c for c in columns if any(k in c.lower() for k in ["desc", "title", "name", "item_desc"])), None)
    cat_col = next((c for c in columns if any(k in c.lower() for k in ["cat", "department", "family"])), None)

    total_rows = len(df)
    seen_skus = set()
    error_rows = 0
    duplicate_rows = 0
    missing_brand_rows = 0

    batch = Batch(
        filename=file.filename,
        total_records=total_rows,
        status="PENDING",
        progress_percentage=0.0,
        current_step="Uploaded & Validated"
    )
    db.add(batch)
    await db.flush()

    raw_records = []
    preview_items = []

    for idx, row in df.iterrows():
        raw_dict = {str(k): (None if pd.isna(v) else str(v)) for k, v in row.items()}
        
        sku_val = raw_dict.get(sku_col) if sku_col else f"SKU-{idx+1001}"
        brand_val = raw_dict.get(brand_col) if brand_col else None
        desc_val = raw_dict.get(desc_col) if desc_col else " ".join([str(v) for v in raw_dict.values() if v])
        cat_val = raw_dict.get(cat_col) if cat_col else None

        # Validation checks
        has_error = False
        err_msg = None
        if not desc_val or len(str(desc_val).strip()) == 0:
            has_error = True
            err_msg = "Missing product description string"
            error_rows += 1

        is_dup = False
        if sku_val:
            if sku_val in seen_skus:
                is_dup = True
                duplicate_rows += 1
            else:
                seen_skus.add(sku_val)

        if not brand_val or cleaner_engine.clean_placeholder(brand_val) is None:
            missing_brand_rows += 1

        raw_prod = RawProduct(
            batch_id=batch.id,
            row_index=idx,
            raw_sku=sku_val,
            raw_brand=brand_val,
            raw_description=desc_val,
            raw_category=cat_val,
            raw_data=raw_dict,
            has_error=has_error,
            error_message=err_msg,
            is_duplicate=is_dup
        )
        db.add(raw_prod)
        
        if idx < 5:
            preview_items.append({
                "row_index": idx + 1,
                "sku": sku_val,
                "brand": brand_val,
                "description": desc_val,
                "category": cat_val,
                "has_error": has_error,
                "is_duplicate": is_dup
            })

    batch.error_records = error_rows
    batch.duplicate_records = duplicate_rows
    batch.missing_brand_records = missing_brand_rows
    batch.logs = [f"Ingested {total_rows} rows from '{file.filename}'. Found {error_rows} errors, {duplicate_rows} duplicates, {missing_brand_rows} missing brands."]
    
    await db.commit()

    return UploadResponse(
        batch_id=batch.id,
        filename=file.filename,
        total_rows=total_rows,
        error_rows=error_rows,
        duplicate_rows=duplicate_rows,
        missing_brand_rows=missing_brand_rows,
        columns_detected=columns,
        preview_records=preview_items,
        message=f"Successfully ingested {total_rows} products. Ready for enrichment."
    )
