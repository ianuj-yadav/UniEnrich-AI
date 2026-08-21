import re
import json
import html
from pathlib import Path
from typing import Optional, Tuple, Dict
from app.core.config import settings

# Placeholder patterns that should be treated as NULL / None
PLACEHOLDER_PATTERNS = {
    "-- unbranded --", "unbranded", "n/a", "na", "null", "none", "unknown", 
    ".", "-", "--", "- -", "0", "000000", "not specified", "tbd", "undefined"
}

class CleanerEngine:
    def __init__(self, abbreviations_path: Optional[str] = None):
        path = abbreviations_path or settings.ABBREVIATIONS_PATH
        self.abbreviations: Dict[str, str] = {}
        try:
            if Path(path).exists():
                with open(path, "r", encoding="utf-8") as f:
                    self.abbreviations = json.load(f)
        except Exception as e:
            print(f"Warning loading abbreviations: {e}")

    def clean_text(self, text: Optional[str]) -> Optional[str]:
        if text is None:
            return None
        
        # 1. Decode HTML entities and strip HTML tags
        cleaned = html.unescape(str(text))
        cleaned = re.sub(r"<[^>]+>", " ", cleaned)
        
        # 2. Normalize whitespace and non-printable characters
        cleaned = re.sub(r"[\r\n\t\x00-\x1f\x7f-\x9f]", " ", cleaned)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        
        # 3. Check for placeholder strings
        if cleaned.lower() in PLACEHOLDER_PATTERNS or len(cleaned) == 0:
            return None
            
        return cleaned

    def clean_placeholder(self, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = str(value).strip()
        if cleaned.lower() in PLACEHOLDER_PATTERNS or len(cleaned) == 0:
            return None
        return cleaned

    def expand_abbreviations(self, text: Optional[str]) -> Tuple[Optional[str], int]:
        """
        Expands industrial abbreviations (e.g. CPLG -> Coupling, BRS -> Brass, 150# -> 150 PSI)
        Returns (expanded_text, count_of_expansions)
        """
        if not text:
            return text, 0
            
        expanded = text
        expansions_count = 0
        
        # Specific pattern: '150#' or '300#' -> '150 PSI' or '300 PSI'
        pressure_hash_pattern = re.compile(r"(\b\d+)\s*#(?!\w)")
        if pressure_hash_pattern.search(expanded):
            expanded, n = pressure_hash_pattern.subn(r"\1 PSI", expanded)
            expansions_count += n

        # Match whole word abbreviations
        for abbr, full_form in self.abbreviations.items():
            if "#" in abbr:
                continue  # Handled above
            pattern = re.compile(rf"\b{re.escape(abbr)}\b", re.IGNORECASE)
            matches = len(pattern.findall(expanded))
            if matches > 0:
                expanded = pattern.sub(full_form, expanded)
                expansions_count += matches
                
        # Clean extra spaces resulting from expansion
        expanded = re.sub(r"\s+", " ", expanded).strip()
        return expanded, expansions_count

cleaner_engine = CleanerEngine()
