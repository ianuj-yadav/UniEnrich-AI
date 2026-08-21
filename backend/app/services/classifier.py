import re
from typing import Dict, Any, Tuple, Optional

# Master Industrial Taxonomy Map with UNSPSC codes
TAXONOMY_RULES = [
    {
        "keywords": [r"\b(?:COUPLING|CPLG|ADAPTER|UNION|NIPPLE|BUSHING|TEE|ELBOW)\b"],
        "category": "Plumbing & Piping",
        "subcategory": "Pipe Fittings & Connectors",
        "product_family": "Pipe Couplings & Fittings",
        "unspsc": "40141700"
    },
    {
        "keywords": [r"\b(?:VALVE|VALV|VLV|BALL VALVE|CHECK VALVE|GATE VALVE)\b"],
        "category": "Plumbing & Piping",
        "subcategory": "Valves & Actuators",
        "product_family": "Manual & Automated Valves",
        "unspsc": "40141600"
    },
    {
        "keywords": [r"\b(?:FLANGE|FLG)\b"],
        "category": "Plumbing & Piping",
        "subcategory": "Flanges",
        "product_family": "Pipe Flanges",
        "unspsc": "40141734"
    },
    {
        "keywords": [r"\b(?:BREAKER|CIRCUIT BREAKER|QO\d+|LOAD CENTER)\b"],
        "category": "Electrical & Lighting",
        "subcategory": "Circuit Protection",
        "product_family": "Molded Case Circuit Breakers",
        "unspsc": "39121601"
    },
    {
        "keywords": [r"\b(?:DRILL|IMPACT WRENCH|GRINDER|SAW|ROTARY HAMMER)\b"],
        "category": "Tools & Hardware",
        "subcategory": "Power Tools",
        "product_family": "Cordless & Corded Power Tools",
        "unspsc": "27112700"
    },
    {
        "keywords": [r"\b(?:PLIERS|CUTTERS|WRENCH|SCREWDRIVER|SOCKET)\b"],
        "category": "Tools & Hardware",
        "subcategory": "Hand Tools",
        "product_family": "Pliers & Clamping Hand Tools",
        "unspsc": "27112100"
    },
    {
        "keywords": [r"\b(?:DISHWASHER|REFRIGERATOR|OVEN|RANGE|MICROWAVE)\b"],
        "category": "Appliances",
        "subcategory": "Kitchen Appliances",
        "product_family": "Dishwashers",
        "unspsc": "52141501"
    },
    {
        "keywords": [r"\b(?:HOSE|TUBE|TUBING|COMPRESSION ELBOW)\b"],
        "category": "Hydraulics & Pneumatics",
        "subcategory": "Tubing & Hose Fittings",
        "product_family": "Fluid Transfer Fittings",
        "unspsc": "40142000"
    }
]

class ProductClassifier:
    def classify(self, text: str, raw_category: Optional[str] = None) -> Tuple[str, str, str, str, float]:
        """
        Classifies product into (category, subcategory, product_family, unspsc, confidence)
        """
        combined = f"{raw_category or ''} {text}".strip().upper()
        
        for rule in TAXONOMY_RULES:
            for kw_pattern in rule["keywords"]:
                if re.search(kw_pattern, combined, re.IGNORECASE):
                    return (
                        rule["category"],
                        rule["subcategory"],
                        rule["product_family"],
                        rule["unspsc"],
                        0.94
                    )

        # Fallback if raw category provided
        if raw_category and raw_category.strip():
            return (
                raw_category.strip().title(),
                "General Supplies",
                "Industrial Catalog Items",
                "24112400",
                0.72
            )

        # Default fallback
        return (
            "Industrial Supplies",
            "General MRO",
            "Hardware & Maintenance",
            "24112400",
            0.50
        )

product_classifier = ProductClassifier()
