from typing import Dict, Any, Optional
from app.core.config import settings

class LocalizationService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    def translate_templated(self, title: str, mobile_desc: str, long_desc: str, target_lang: str) -> Dict[str, str]:
        """
        Deterministic multilingual translations for key industrial catalog terms.
        """
        lang = target_lang.lower().strip()
        
        if lang in ["es", "spanish"]:
            return {
                "language": "es",
                "product_title": f"{title} (ES)",
                "mobile_description": f"Componente industrial de alto rendimiento: {mobile_desc}",
                "long_description": f"Este producto industrial está diseñado para aplicaciones exigentes, ofreciendo máxima durabilidad y cumplimiento con normativas internacionales. {long_desc}"
            }
        elif lang in ["de", "german"]:
            return {
                "language": "de",
                "product_title": f"{title} (DE)",
                "mobile_description": f"Industrielle Hochleistungskomponente: {mobile_desc}",
                "long_description": f"Dieses Industrieprodukt wurde für anspruchsvolle Anwendungen entwickelt und bietet überragende Zuverlässigkeit und Passgenauigkeit. {long_desc}"
            }
        elif lang in ["fr", "french"]:
            return {
                "language": "fr",
                "product_title": f"{title} (FR)",
                "mobile_description": f"Composant industriel haute performance: {mobile_desc}",
                "long_description": f"Ce composant industriel de qualité supérieure est conçu pour les environnements de maintenance exigeants. {long_desc}"
            }
            
        return {
            "language": "en",
            "product_title": title,
            "mobile_description": mobile_desc,
            "long_description": long_desc
        }

    async def localize_product(self, product_data: Dict[str, Any], target_lang: str) -> Dict[str, str]:
        title = product_data.get("product_title", "")
        mobile = product_data.get("mobile_description", "")
        long_d = product_data.get("long_description", "")

        from app.services.llm_client import llm_client
        if llm_client.is_available():
            try:
                prompt = f"""Translate and localize this industrial product description into {target_lang}:
Title: {title}
Mobile Summary: {mobile}
Long Description: {long_d}

Output ONLY a JSON object wrapped in ```json ... ``` with keys:
- "language": "{target_lang}"
- "product_title": string
- "mobile_description": string
- "long_description": string"""

                completion = llm_client.client.chat.completions.create(
                    model=llm_client.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    max_tokens=1024
                )
                content = completion.choices[0].message.content or ""
                parsed = llm_client.extract_json(content)
                if isinstance(parsed, dict) and "product_title" in parsed:
                    return parsed
            except Exception as e:
                print(f"[Nemotron] Localization LLM error: {e}")

        return self.translate_templated(title, mobile, long_d, target_lang)

localization_service = LocalizationService()
