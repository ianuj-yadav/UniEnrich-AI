from typing import Dict, Tuple
from app.core.config import settings

class ConfidenceEngine:
    def __init__(self):
        self.w_brand = 0.20
        self.w_category = 0.20
        self.w_attributes = 0.35
        self.w_description = 0.25
        self.auto_approve_threshold = settings.AUTO_APPROVE_THRESHOLD
        self.critical_field_threshold = settings.CRITICAL_FIELD_THRESHOLD

    def calculate_score(
        self,
        brand_conf: float,
        cat_conf: float,
        attr_conf: float,
        desc_conf: float
    ) -> Tuple[float, Dict[str, float], str]:
        """
        Calculates aggregate confidence score and determines review routing.
        Returns (aggregate_score, breakdown_dict, review_status)
        """
        aggregate = (
            self.w_brand * brand_conf +
            self.w_category * cat_conf +
            self.w_attributes * attr_conf +
            self.w_description * desc_conf
        )
        aggregate = round(aggregate, 4)

        breakdown = {
            "brand": round(brand_conf, 2),
            "category": round(cat_conf, 2),
            "attributes": round(attr_conf, 2),
            "description": round(desc_conf, 2),
            "aggregate": aggregate
        }

        # Check routing conditions
        if (
            aggregate < self.auto_approve_threshold or
            brand_conf < self.critical_field_threshold or
            cat_conf < self.critical_field_threshold
        ):
            status = "NEEDS_REVIEW"
        else:
            status = "AUTO_APPROVED"

        return aggregate, breakdown, status

confidence_engine = ConfidenceEngine()
