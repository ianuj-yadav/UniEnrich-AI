import re
from typing import Dict, Any, Tuple, Optional
from app.core.config import settings

class DescriptionGenerator:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    def generate_templated_title(self, brand: Optional[str], sku: Optional[str], attributes: Dict[str, Any], cleaned_desc: str, family: str) -> str:
        parts = []
        if brand:
            parts.append(brand)
        if "Series" in attributes:
            parts.append(attributes["Series"])
        if "Size" in attributes:
            parts.append(attributes["Size"])
        if "Material" in attributes:
            parts.append(attributes["Material"])
            
        # Add core item name if not already represented
        desc_clean = cleaned_desc
        for p in parts:
            desc_clean = re.sub(rf"\b{re.escape(p)}\b", "", desc_clean, flags=re.IGNORECASE)
        desc_clean = re.sub(r"\s+", " ", desc_clean).strip()
        
        if desc_clean:
            # Title case the remainder
            parts.append(desc_clean.title())
        elif family:
            parts.append(family)
            
        if "Pressure Rating" in attributes and "Pressure Rating" not in " ".join(parts):
            parts.append(f", {attributes['Pressure Rating']}")
            
        title = " ".join(parts)
        title = re.sub(r"\s+,", ",", title)
        title = re.sub(r"\s+", " ", title).strip()
        return title

    def generate_templated_mobile_desc(self, brand: Optional[str], title: str, attributes: Dict[str, Any]) -> str:
        brand_prefix = f"{brand} " if brand else ""
        specs = []
        if "Material" in attributes:
            specs.append(f"{attributes['Material']} construction")
        if "Size" in attributes:
            specs.append(f"{attributes['Size']} sizing")
        if "Pressure Rating" in attributes:
            specs.append(f"rated for {attributes['Pressure Rating']}")
        if "Voltage" in attributes:
            specs.append(f"{attributes['Voltage']} power")
            
        spec_str = f" featuring {', '.join(specs)}" if specs else ""
        return f"Heavy-duty {brand_prefix}{title}{spec_str}, engineered for reliable industrial performance."

    def generate_templated_long_desc(self, brand: Optional[str], title: str, attributes: Dict[str, Any], category: str, subcategory: str) -> str:
        brand_str = brand if brand else "Premium industrial"
        attr_clauses = []
        for k, v in attributes.items():
            attr_clauses.append(f"{k.lower()} of {v}")
            
        attr_sentence = f" Key technical specifications include a {', '.join(attr_clauses)}." if attr_clauses else ""
        
        return (
            f"The {brand_str} {title} is an industrial-grade solution designed for demanding applications within {category.lower()} and {subcategory.lower()}."
            f"{attr_sentence}"
            f" Manufactured to meet stringent quality standards, this component delivers superior durability, precise fitment, and dependable service life in commercial and MRO environments."
        )

    async def generate_descriptions(
        self,
        brand: Optional[str],
        sku: Optional[str],
        cleaned_desc: str,
        category: str,
        subcategory: str,
        product_family: str,
        attributes: Dict[str, Any]
    ) -> Tuple[str, str, str, float]:
        """
        Generates (product_title, mobile_desc, long_desc, confidence)
        """
        # 1. Attempt LLM generation via NVIDIA Nemotron
        from app.services.llm_client import llm_client
        if llm_client.is_available():
            try:
                import json
                prompt = f"""You are an expert industrial catalog copywriter.
Generate 3 fields based on these product details:
Brand: {brand or 'Generic'}
Original Description: {cleaned_desc}
Category: {category} > {subcategory}
Attributes: {json.dumps(attributes)}

Output ONLY a JSON object wrapped in ```json ... ``` with:
1. "product_title": Concise, standardized SEO title ([Brand] + [Specs] + [Product Type]).
2. "mobile_description": 1-2 sentence mobile summary.
3. "long_description": Professional 1-paragraph e-commerce description incorporating the attributes."""

                completion = llm_client.client.chat.completions.create(
                    model=llm_client.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    max_tokens=1024
                )
                content = completion.choices[0].message.content or ""
                parsed = llm_client.extract_json(content)
                if isinstance(parsed, dict) and "product_title" in parsed:
                    return (
                        parsed.get("product_title", ""),
                        parsed.get("mobile_description", ""),
                        parsed.get("long_description", ""),
                        0.97
                    )
            except Exception as e:
                print(f"[Nemotron] Description Gen error, falling back to template engine: {e}")

        # Deterministic generation
        title = self.generate_templated_title(brand, sku, attributes, cleaned_desc, product_family)
        mobile_desc = self.generate_templated_mobile_desc(brand, title, attributes)
        long_desc = self.generate_templated_long_desc(brand, title, attributes, category, subcategory)
        
        return title, mobile_desc, long_desc, 0.90

description_generator = DescriptionGenerator()
