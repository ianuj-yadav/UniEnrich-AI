import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.cleaner import cleaner_engine
from app.services.brand_matcher import brand_resolver

class RulesService:
    def __init__(self):
        self.abbr_path = settings.ABBREVIATIONS_PATH
        self.brands_path = settings.BRANDS_PATH

    def get_all_rules(self) -> Dict[str, Any]:
        abbrs = {}
        brands = []
        if Path(self.abbr_path).exists():
            with open(self.abbr_path, "r", encoding="utf-8") as f:
                abbrs = json.load(f)
        if Path(self.brands_path).exists():
            with open(self.brands_path, "r", encoding="utf-8") as f:
                brands = json.load(f)
        return {
            "abbreviations": abbrs,
            "brands": brands,
            "total_abbreviations": len(abbrs),
            "total_brands": len(brands)
        }

    def add_abbreviation(self, acronym: str, expansion: str) -> Dict[str, Any]:
        abbrs = {}
        if Path(self.abbr_path).exists():
            with open(self.abbr_path, "r", encoding="utf-8") as f:
                abbrs = json.load(f)
        
        clean_acronym = acronym.strip().upper()
        abbrs[clean_acronym] = expansion.strip()
        
        with open(self.abbr_path, "w", encoding="utf-8") as f:
            json.dump(abbrs, f, indent=2)

        # Update running engine in memory
        cleaner_engine.abbreviations[clean_acronym] = expansion.strip()
        return {"status": "SUCCESS", "acronym": clean_acronym, "expansion": expansion.strip()}

    def add_brand_rule(self, canonical_name: str, manufacturer: str, aliases: List[str]) -> Dict[str, Any]:
        brands = []
        if Path(self.brands_path).exists():
            with open(self.brands_path, "r", encoding="utf-8") as f:
                brands = json.load(f)
        
        new_brand = {
            "canonical_name": canonical_name.strip(),
            "manufacturer": manufacturer.strip(),
            "aliases": [a.strip() for a in aliases if a.strip()]
        }
        brands.append(new_brand)

        with open(self.brands_path, "w", encoding="utf-8") as f:
            json.dump(brands, f, indent=2)

        # Reload brand resolver
        brand_resolver.__init__()
        return {"status": "SUCCESS", "brand": new_brand}

    def test_transformation(self, raw_input: str) -> Dict[str, Any]:
        """
        Live scratchpad testing raw string through cleaner and abbreviation expander.
        """
        cleaned_raw = cleaner_engine.clean_text(raw_input)
        expanded, exp_count = cleaner_engine.expand_abbreviations(cleaned_raw)
        brand, mfr, conf = brand_resolver.resolve_brand(None, expanded or raw_input)

        return {
            "original_input": raw_input,
            "cleaned_text": cleaned_raw,
            "expanded_text": expanded,
            "expansions_triggered": exp_count,
            "resolved_brand": brand,
            "resolved_manufacturer": mfr,
            "brand_confidence": conf
        }

rules_service = RulesService()
