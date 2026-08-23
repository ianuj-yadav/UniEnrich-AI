import json
import re
from typing import Any, Dict, List, Optional
from openai import OpenAI
from app.core.config import settings

class LLMClient:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL
        self.model = settings.NVIDIA_MODEL
        self._client: Optional[OpenAI] = None

    @property
    def client(self) -> Optional[OpenAI]:
        if not self._client and self.api_key:
            self._client = OpenAI(
                base_url=self.base_url,
                api_key=self.api_key
            )
        return self._client

    def is_available(self) -> bool:
        return bool(self.api_key and self.client)

    def extract_json(self, text: str) -> Dict[str, Any]:
        """Extracts JSON object from LLM response containing markdown or reasoning text."""
        if not text:
            return {}
        
        # 1. Try finding json inside ```json ... ```
        match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass

        # 2. Try finding json inside ``` ... ```
        match = re.search(r"```\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass

        # 3. Try finding any outer JSON curly braces {...}
        match = re.search(r"\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass

        # 4. Direct JSON parse
        try:
            return json.loads(text.strip())
        except Exception:
            return {}

    def extract_attributes(self, raw_description: str, brand: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Extracts technical attributes from raw description string via Nemotron."""
        if not self.is_available():
            return None

        prompt = f"""You are an expert industrial catalog engineer.
Extract all structured technical engineering attributes and specifications from this product SKU:
Product: "{raw_description}"
Brand: "{brand or 'Unknown'}"

Output ONLY a valid JSON object wrapped in ```json ... ``` with extracted key-value pairs (e.g. material, size, pressure, thread_type, voltage, finish, package_quantity).
Standardize values with units where appropriate."""

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=2048,
            )
            content = completion.choices[0].message.content or ""
            parsed = self.extract_json(content)
            if isinstance(parsed, dict) and len(parsed) > 0:
                return parsed
        except Exception as e:
            print(f"[Nemotron] Attribute extraction error: {e}")
        return None

    def generate_description(self, title: str, brand: str, category: str, attributes: Dict[str, Any]) -> Optional[str]:
        """Generates rich, professional industrial marketing overview via Nemotron."""
        if not self.is_available():
            return None

        attr_str = ", ".join([f"{k}: {v}" for k, v in attributes.items()]) if attributes else "Standard specs"
        prompt = f"""Write a professional, search-optimized technical catalog product overview for:
Title: {title}
Brand: {brand}
Category: {category}
Specifications: {attr_str}

Write 2 concise, highly accurate sentences describing the component, its engineering applications, and compliance standards."""

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=512,
            )
            content = completion.choices[0].message.content or ""
            # Strip reasoning preamble if present
            if "```" in content:
                content = content.split("```")[-1].strip()
            return content.strip()
        except Exception as e:
            print(f"[Nemotron] Description generation error: {e}")
        return None

    def translate_catalog(self, title: str, description: str, target_lang: str) -> Optional[Dict[str, str]]:
        """Translates title and description into target language via Nemotron."""
        if not self.is_available():
            return None

        prompt = f"""Translate this industrial catalog product into {target_lang}. Preserve all metric/imperial units and model numbers verbatim:
Title: "{title}"
Description: "{description}"

Output ONLY a JSON object wrapped in ```json ... ``` with keys "title" and "description"."""

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=1024,
            )
            content = completion.choices[0].message.content or ""
            parsed = self.extract_json(content)
            if isinstance(parsed, dict) and "title" in parsed:
                return parsed
        except Exception as e:
            print(f"[Nemotron] Translation error: {e}")
        return None

llm_client = LLMClient()
