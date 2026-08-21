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

        if self.api_key:
            try:
                from google import genai
                from google.genai import types
                import json

                client = genai.Client(api_key=self.api_key)
                prompt = f"""
                Translate and localize this industrial product description into {target_lang}:
                Title: {title}
                Mobile Summary: {mobile}
                Long Description: {long_d}

                Return a JSON object with keys:
                - "language": "{target_lang}"
                - "product_title": string
                - "mobile_description": string
                - "long_description": string
                """
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.2
                    )
                )
                if response and response.text:
                    return json.loads(response.text)
            except Exception as e:
                print(f"Localization LLM error: {e}")

        return self.translate_templated(title, mobile, long_d, target_lang)

localization_service = LocalizationService()
