import re
import json
from typing import Dict, Any, Tuple, Optional
from app.core.config import settings

class AttributeExtractor:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    def rule_based_extract(self, text: str) -> Tuple[Dict[str, Any], float]:
        """
        High-precision deterministic rule-based extractor for industrial MRO attributes.
        """
        attributes: Dict[str, Any] = {}
        text_upper = text.upper()
        
        # 1. Size / Diameter
        size_match = re.search(r"(\b\d+(?:/\d+)?(?:\s*-\s*\d+/\d+)?|\b\d+\.?\d*)\s*(?:IN(?:CH)?|INCH|\"|'|MM|CM)\b", text, re.IGNORECASE)
        if size_match:
            attributes["Size"] = size_match.group(0).replace('"', ' in').strip()
        else:
            fraction_match = re.search(r"\b(\d+/\d+)\b", text)
            if fraction_match:
                attributes["Size"] = f"{fraction_match.group(1)} in"

        # 2. Material
        materials = [
            ("Stainless Steel 316", r"\b(?:SS\s*316|316\s*SS|Stainless Steel 316)\b"),
            ("Stainless Steel 304", r"\b(?:SS\s*304|304\s*SS|Stainless Steel 304)\b"),
            ("Stainless Steel", r"\b(?:Stainless Steel|SS|ST ST|S/S)\b"),
            ("Brass", r"\b(?:Brass|BRS)\b"),
            ("Carbon Steel", r"\b(?:Carbon Steel|CS)\b"),
            ("Cast Iron", r"\b(?:Cast Iron|CI)\b"),
            ("Ductile Iron", r"\b(?:Ductile Iron|DI)\b"),
            ("PVC", r"\b(?:PVC|Polyvinyl Chloride)\b"),
            ("CPVC", r"\b(?:CPVC)\b"),
            ("Copper", r"\b(?:Copper|CPR)\b"),
            ("Aluminum", r"\b(?:Aluminum|ALUM)\b"),
            ("Bronze", r"\b(?:Bronze|BRZ)\b")
        ]
        for mat_name, pattern in materials:
            if re.search(pattern, text, re.IGNORECASE):
                attributes["Material"] = mat_name
                break

        # 3. Pressure Rating
        pressure_match = re.search(r"\b(\d+)\s*(?:PSI|#|LB|WOG|BAR|KPA)\b", text, re.IGNORECASE)
        if pressure_match:
            attributes["Pressure Rating"] = f"{pressure_match.group(1)} psi"

        # 4. Voltage
        voltage_match = re.search(r"\b(\d+V(?:DC|AC)?|\d+\s*VOLT(?:S)?|\d+\s*V)\b", text, re.IGNORECASE)
        if voltage_match:
            v_val = voltage_match.group(1).upper().replace("VOLTS", "V").replace("VOLT", "V").strip()
            attributes["Voltage"] = v_val

        # 5. Connection / Thread Type
        if re.search(r"\b(?:FNPT|FPT|FEMALE\s*NPT)\b", text, re.IGNORECASE):
            attributes["Connection Type"] = "Female NPT"
            attributes["Thread Type"] = "NPT"
        elif re.search(r"\b(?:MNPT|MPT|MALE\s*NPT)\b", text, re.IGNORECASE):
            attributes["Connection Type"] = "Male NPT"
            attributes["Thread Type"] = "NPT"
        elif re.search(r"\b(?:NPT)\b", text, re.IGNORECASE):
            attributes["Thread Type"] = "NPT"
        elif re.search(r"\b(?:SLIP\s*X\s*SLIP|SLIP)\b", text, re.IGNORECASE):
            attributes["Connection Type"] = "Slip x Slip"
        elif re.search(r"\b(?:FLANGED|FLG)\b", text, re.IGNORECASE):
            attributes["Connection Type"] = "Flanged"
        elif re.search(r"\b(?:COMPRESSION)\b", text, re.IGNORECASE):
            attributes["Connection Type"] = "Compression"

        # 6. Schedule / Rating
        sch_match = re.search(r"\b(SCH(?:EDULE)?\s*\d+)\b", text, re.IGNORECASE)
        if sch_match:
            attributes["Schedule"] = sch_match.group(1).upper()

        # 7. Finish / Coating
        if re.search(r"\b(?:GALV(?:ANIZED)?)\b", text, re.IGNORECASE):
            attributes["Finish"] = "Galvanized"
        elif re.search(r"\b(?:ZINC|ZN)\b", text, re.IGNORECASE):
            attributes["Finish"] = "Zinc Plated"
        elif re.search(r"\b(?:BLACK OXIDE|BLK)\b", text, re.IGNORECASE):
            attributes["Finish"] = "Black Oxide"

        # 8. Series / Motor Specs
        if re.search(r"\b(?:M18 FUEL)\b", text, re.IGNORECASE):
            attributes["Series"] = "M18 FUEL™"
        elif re.search(r"\b(?:20V MAX)\b", text, re.IGNORECASE):
            attributes["Series"] = "20V MAX*"
        elif re.search(r"\b(?:BRUSHLESS|BL MOTOR)\b", text, re.IGNORECASE):
            attributes["Motor Type"] = "Brushless"

        # Calculate confidence based on extraction count
        count = len(attributes)
        confidence = 0.95 if count >= 3 else (0.80 if count == 2 else (0.65 if count == 1 else 0.40))
        return attributes, confidence

    async def extract_attributes(self, raw_description: str, cleaned_description: str, brand: Optional[str] = None) -> Tuple[Dict[str, Any], float]:
        """
        Extracts structured attributes using NVIDIA Nemotron 30B / LLM if configured, with rule-based fallback.
        """
        input_text = cleaned_description or raw_description or ""
        
        # 1. Attempt LLM Extraction via NVIDIA Nemotron
        from app.services.llm_client import llm_client
        if llm_client.is_available():
            nemotron_result = llm_client.extract_attributes(input_text, brand)
            if nemotron_result and isinstance(nemotron_result, dict) and len(nemotron_result) > 0:
                # Merge with any detected rule-based attributes to ensure maximum recall
                rule_attrs, _ = self.rule_based_extract(input_text)
                merged = {**rule_attrs, **nemotron_result}
                return merged, 0.98

        # 2. Fallback to high-speed deterministic extractor
        return self.rule_based_extract(input_text)

attribute_extractor = AttributeExtractor()
