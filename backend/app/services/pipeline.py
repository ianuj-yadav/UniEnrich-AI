import asyncio
from datetime import datetime
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Batch, RawProduct, EnrichedProduct
from app.services.cleaner import cleaner_engine
from app.services.brand_matcher import brand_resolver
from app.services.attribute_extractor import attribute_extractor
from app.services.classifier import product_classifier
from app.services.description_generator import description_generator
from app.services.confidence import confidence_engine

class EnrichmentPipeline:
    async def process_batch(self, batch_id: str, db: AsyncSession):
        # Fetch batch
        batch_result = await db.execute(select(Batch).where(Batch.id == batch_id))
        batch = batch_result.scalar_one_or_none()
        if not batch:
            return

        batch.status = "PROCESSING"
        batch.progress_percentage = 5.0
        batch.current_step = "Starting Data Cleaning Engine..."
        batch.logs.append(f"[{datetime.utcnow().strftime('%H:%M:%S')}] Initialized pipeline for batch {batch_id}")
        await db.commit()

        # Fetch raw products for this batch
        raw_result = await db.execute(
            select(RawProduct).where(RawProduct.batch_id == batch_id).order_by(RawProduct.row_index)
        )
        raw_products = raw_result.scalars().all()
        total = len(raw_products)
        if total == 0:
            batch.status = "COMPLETED"
            batch.progress_percentage = 100.0
            batch.current_step = "Completed (No records)"
            await db.commit()
            return

        # Delete existing enriched products if re-running
        existing_enriched = await db.execute(select(EnrichedProduct).where(EnrichedProduct.batch_id == batch_id))
        for ep in existing_enriched.scalars().all():
            await db.delete(ep)
        await db.commit()

        # Process each product through the 7-step enrichment sequence
        for idx, raw in enumerate(raw_products):
            # Step 1: Cleaning & Placeholder Neutralization
            cleaned_brand = cleaner_engine.clean_placeholder(raw.raw_brand)
            cleaned_desc_raw = cleaner_engine.clean_text(raw.raw_description)
            expanded_desc, expansions = cleaner_engine.expand_abbreviations(cleaned_desc_raw)
            cleaned_desc = expanded_desc or cleaned_desc_raw or ""

            # Step 2: Brand Resolution (RapidFuzz + Alias Master Lookup)
            resolved_brand, resolved_mfr, brand_conf = brand_resolver.resolve_brand(
                cleaned_brand, raw.raw_description
            )

            # Step 3: AI Attribute Extraction (Gemini 2.5 Flash / Rule Fallback)
            extracted_attrs, attr_conf = await attribute_extractor.extract_attributes(
                raw.raw_description or "",
                cleaned_desc,
                resolved_brand
            )

            # Step 4: Classification & UNSPSC Taxonomy
            category, subcat, family, unspsc, cat_conf = product_classifier.classify(
                f"{resolved_brand or ''} {cleaned_desc}",
                raw.raw_category
            )

            # Step 5: Description Synthesis (Title, Mobile, Long)
            title, mobile_desc, long_desc, desc_conf = await description_generator.generate_descriptions(
                resolved_brand,
                raw.raw_sku,
                cleaned_desc,
                category,
                subcat,
                family,
                extracted_attrs
            )

            # Step 6: Confidence Scoring & Review Routing
            agg_score, breakdown, review_status = confidence_engine.calculate_score(
                brand_conf, cat_conf, attr_conf, desc_conf
            )

            # Create Enriched Record
            enriched = EnrichedProduct(
                raw_product_id=raw.id,
                batch_id=batch.id,
                canonical_sku=raw.raw_sku,
                cleaned_description=cleaned_desc,
                resolved_brand=resolved_brand,
                resolved_manufacturer=resolved_mfr,
                brand_confidence=brand_conf,
                category=category,
                subcategory=subcat,
                product_family=family,
                unspsc_code=unspsc,
                category_confidence=cat_conf,
                extracted_attributes=extracted_attrs,
                attribute_confidence=attr_conf,
                product_title=title,
                mobile_description=mobile_desc,
                long_description=long_desc,
                description_confidence=desc_conf,
                confidence_score=agg_score,
                confidence_breakdown=breakdown,
                review_status=review_status
            )
            db.add(enriched)

            # Update batch progress periodically
            processed = idx + 1
            percent = round(10.0 + (processed / total) * 85.0, 1)
            batch.processed_records = processed
            batch.progress_percentage = percent
            
            if processed % 2 == 0 or processed == total:
                step_name = f"Processing SKU {raw.raw_sku or processed}/{total}: {title[:35]}..."
                batch.current_step = step_name
                batch.logs.append(f"[{datetime.utcnow().strftime('%H:%M:%S')}] {step_name} (Confidence: {int(agg_score*100)}%)")
                await db.commit()

        batch.status = "COMPLETED"
        batch.progress_percentage = 100.0
        batch.current_step = "Enrichment Complete"
        batch.completed_at = datetime.utcnow()
        batch.logs.append(f"[{datetime.utcnow().strftime('%H:%M:%S')}] Batch processing finished successfully. {total} products enriched.")
        await db.commit()

enrichment_pipeline = EnrichmentPipeline()
