import json
import re
from pathlib import Path
from typing import Optional, Tuple, List, Dict
from rapidfuzz import fuzz, process
from app.core.config import settings

class BrandResolver:
    def __init__(self, brands_path: Optional[str] = None):
        path = brands_path or settings.BRANDS_PATH
        self.canonical_brands: List[Dict] = []
        self.alias_to_canonical: Dict[str, Tuple[str, str]] = {}
        self.search_corpus: List[str] = []

        try:
            if Path(path).exists():
                with open(path, "r", encoding="utf-8") as f:
                    self.canonical_brands = json.load(f)
                    
            for item in self.canonical_brands:
                canonical = item["canonical_name"]
                mfr = item.get("manufacturer", "")
                
                # Clean canonical for lookup
                clean_canon = re.sub(r"[™®©]", "", canonical).strip()
                self.alias_to_canonical[clean_canon.lower()] = (canonical, mfr)
                self.search_corpus.append(clean_canon)
                
                for alias in item.get("aliases", []):
                    clean_alias = re.sub(r"[™®©]", "", alias).strip()
                    self.alias_to_canonical[clean_alias.lower()] = (canonical, mfr)
                    self.search_corpus.append(clean_alias)
                    
        except Exception as e:
            print(f"Warning loading standard brands: {e}")

    def resolve_brand(self, raw_brand: Optional[str], raw_description: Optional[str] = None) -> Tuple[Optional[str], Optional[str], float]:
        """
        Resolves a raw brand or extracts it from the description.
        Returns (canonical_brand, manufacturer, confidence)
        """
        # Case 1: Raw brand provided
        if raw_brand and str(raw_brand).strip():
            cleaned_input = re.sub(r"[™®©]", "", str(raw_brand)).strip()
            
            # Exact lookup
            if cleaned_input.lower() in self.alias_to_canonical:
                canonical, mfr = self.alias_to_canonical[cleaned_input.lower()]
                return canonical, mfr, 0.99
                
            # Fuzzy match via RapidFuzz
            if self.search_corpus:
                match = process.extractOne(
                    cleaned_input,
                    self.search_corpus,
                    scorer=fuzz.WRatio
                )
                if match:
                    best_match_str, score, _ = match
                    if score >= 80:
                        canonical, mfr = self.alias_to_canonical[best_match_str.lower()]
                        confidence = round(score / 100.0, 2)
                        return canonical, mfr, confidence
                    elif score >= 60:
                        canonical, mfr = self.alias_to_canonical[best_match_str.lower()]
                        return canonical, mfr, round(score / 100.0, 2)

            # If no good match, return cleaned title-cased brand
            return str(raw_brand).strip(), None, 0.50

        # Case 2: Brand missing, search inside description
        if raw_description:
            desc_upper = raw_description.upper()
            for alias_key, (canonical, mfr) in self.alias_to_canonical.items():
                if len(alias_key) > 2:
                    pattern = rf"\b{re.escape(alias_key)}\b"
                    if re.search(pattern, desc_upper, re.IGNORECASE):
                        return canonical, mfr, 0.88
                        
        return None, None, 0.0

brand_resolver = BrandResolver()
