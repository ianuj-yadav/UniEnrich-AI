import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATASETS_DIR = BASE_DIR.parent / "datasets"

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniEnrich AI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/unienrich.db"
    
    # AI / LLM Configuration
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
