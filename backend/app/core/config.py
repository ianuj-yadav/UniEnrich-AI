import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATASETS_DIR = BASE_DIR.parent / "datasets"

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniEnrich AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/unienrich.db"
    FRONTEND_ORIGINS: str = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,https://unienrich-ai.vercel.app")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    
    # AI / LLM Configuration (NVIDIA Nemotron 30B / OpenAI SDK)
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_MODEL: str = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")
    
    # Gemini (Optional fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # Dataset Paths
    ABBREVIATIONS_PATH: str = str(DATASETS_DIR / "industrial_abbreviations.json")
    BRANDS_PATH: str = str(DATASETS_DIR / "standard_brands.json")
    SAMPLE_CSV_PATH: str = str(DATASETS_DIR / "sample_messy_catalog.csv")
    
    # Quality & Confidence Routing
    AUTO_APPROVE_THRESHOLD: float = 0.70
    CRITICAL_FIELD_THRESHOLD: float = 0.60
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
