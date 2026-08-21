import re
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Batch, EnrichedProduct, RawProduct, ReviewLog
from app.core.config import settings

class CopilotService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def parse_and_execute_query(
        self,
        prompt: str,
        batch_id: str,
        db: AsyncSession
    ) -> Dict[str, Any]:
        prompt_lower = prompt.lower().strip()
        
        # 1. Fetch batch and products
        prods_query = (
            select(EnrichedProduct, RawProduct)
            .join(RawProduct, EnrichedProduct.raw_product_id == RawProduct.id)
            .where(EnrichedProduct.batch_id == batch_id)
        )
        result = await db.execute(prods_query)
        records = result.all()

        # Intent 1: Brand Mismatches / Inconsistencies
        if any(k in prompt_lower for k in ["brand mismatch", "different brand", "wrong brand", "brand change"]):
            mismatches = []
            for ep, raw in records:
                if raw.raw_brand and ep.resolved_brand and raw.raw_brand.strip().lower() != ep.resolved_brand.strip().lower():
                    mismatches.append({
                        "id": ep.id,
                        "sku": ep.canonical_sku,
                        "raw_brand": raw.raw_brand,
                        "resolved_brand": ep.resolved_brand,
                        "title": ep.product_title
                    })
            return {
                "intent": "BRAND_MISMATCH_QUERY",
                "summary": f"Found {len(mismatches)} products where raw brand differed from resolved canonical brand.",
                "matched_count": len(mismatches),
                "data": mismatches,
                "suggested_actions": ["Accept all canonical brand resolutions", "Flag for human review"]
            }

        # Intent 2: Missing Attribute Search (e.g. "missing pressure", "missing voltage", "missing material")
        for attr_key in ["pressure", "voltage", "material", "size", "thread", "finish"]:
            if f"missing {attr_key}" in prompt_lower or f"no {attr_key}" in prompt_lower:
                missing_items = []
                for ep, raw in records:
                    attrs = ep.extracted_attributes or {}
                    matched_attr = next((v for k, v in attrs.items() if attr_key in k.lower()), None)
                    if not matched_attr:
                        missing_items.append({
                            "id": ep.id,
                            "sku": ep.canonical_sku,
                            "title": ep.product_title,
                            "raw_desc": raw.raw_description,
                            "category": ep.category
                        })
                return {
                    "intent": "MISSING_ATTRIBUTE_QUERY",
                    "attribute": attr_key.title(),
                    "summary": f"Identified {len(missing_items)} products currently lacking '{attr_key.title()}' specification.",
                    "matched_count": len(missing_items),
                    "data": missing_items,
                    "suggested_actions": [f"Bulk set {attr_key.title()}", "Re-run attribute extraction with alternate prompt"]
                }

        # Intent 3: Low Confidence / Review Summary
        if any(k in prompt_lower for k in ["low confidence", "needs review", "review queue", "uncertain"]):
            low_conf = []
            for ep, raw in records:
                if ep.review_status == "NEEDS_REVIEW" or ep.confidence_score < 0.70:
                    low_conf.append({
                        "id": ep.id,
                        "sku": ep.canonical_sku,
                        "title": ep.product_title,
                        "score": f"{int(ep.confidence_score * 100)}%",
                        "reason": "Missing canonical brand or complex abbreviation"
                    })
            return {
                "intent": "LOW_CONFIDENCE_SUMMARY",
                "summary": f"Found {len(low_conf)} items flagged for human review (confidence < 70%).",
                "matched_count": len(low_conf),
                "data": low_conf,
                "suggested_actions": ["Open Review Queue", "Bulk approve high confidence items (>80%)"]
            }

        # Intent 4: Bulk Edit Command (e.g., "set pressure to 150 psi for all couplings")
        set_attr_match = re.search(r"set\s+([a-zA-Z\s]+)\s+to\s+([a-zA-Z0-9\s#/\-\.]+)", prompt, re.IGNORECASE)
        if set_attr_match:
            target_attr = set_attr_match.group(1).strip().title()
            target_val = set_attr_match.group(2).strip()
            
            # Find candidate items to edit
            candidate_ids = []
            for ep, raw in records:
                candidate_ids.append(ep.id)

            return {
                "intent": "BULK_EDIT_PROPOSAL",
                "target_attribute": target_attr,
                "proposed_value": target_val,
                "affected_count": len(candidate_ids),
                "product_ids": candidate_ids,
                "summary": f"Proposed bulk update: Set '{target_attr}' = '{target_val}' across {len(candidate_ids)} records.",
                "requires_confirmation": True
            }

        # Default General Search / Summary
        matched = []
        for ep, raw in records:
            if any(term in (ep.product_title or "").lower() or term in (raw.raw_description or "").lower() for term in prompt_lower.split()):
                matched.append({
                    "id": ep.id,
                    "sku": ep.canonical_sku,
                    "title": ep.product_title,
                    "brand": ep.resolved_brand,
                    "category": ep.category,
                    "confidence": f"{int(ep.confidence_score * 100)}%"
                })

        return {
            "intent": "GENERAL_CATALOG_SEARCH",
            "summary": f"Copilot found {len(matched)} matching catalog records for your query '{prompt}'.",
            "matched_count": len(matched),
            "data": matched[:10],
            "suggested_actions": ["Filter catalog by these items", "Inspect Before/After split view"]
        }

    async def execute_bulk_edit(
        self,
        product_ids: List[str],
        attribute_name: str,
        new_value: str,
        db: AsyncSession,
        reviewer: str = "AI_Copilot"
    ) -> Dict[str, Any]:
        query = select(EnrichedProduct).where(EnrichedProduct.id.in_(product_ids))
        result = await db.execute(query)
        products = result.scalars().all()

        updated_count = 0
        for ep in products:
            attrs = dict(ep.extracted_attributes or {})
            attrs[attribute_name] = new_value
            ep.extracted_attributes = attrs
            ep.is_modified_by_human = True
            ep.confidence_score = 1.0  # Verified
            ep.review_status = "REVIEWED_APPROVED"

            log = ReviewLog(
                enriched_product_id=ep.id,
                field_name=f"attribute:{attribute_name}",
                old_value=str(ep.extracted_attributes.get(attribute_name, "None")),
                new_value=new_value,
                reviewer=reviewer,
                action="COPILOT_BULK_EDIT"
            )
            db.add(log)
            updated_count += 1

        await db.commit()
        return {
            "status": "SUCCESS",
            "updated_count": updated_count,
            "attribute": attribute_name,
            "value": new_value,
            "message": f"Successfully updated '{attribute_name}' to '{new_value}' across {updated_count} products."
        }

copilot_service = CopilotService()
