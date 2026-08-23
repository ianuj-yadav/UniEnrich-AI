from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.db.session import init_db
from app.api.router import api_router
from app.api.v1.auth import ensure_demo_account

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables
    await init_db()
    from app.db.session import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        await ensure_demo_account(session)
    print("Database tables initialized successfully.")
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Industrial Product Data Enrichment API with Gemini 2.5 Flash and RapidFuzz",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend and local static clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.FRONTEND_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount Pure HTML5/CSS3/JS Standalone Application
static_dir = Path(__file__).resolve().parent.parent.parent / "static_ui"
if static_dir.exists():
    app.mount("/ui", StaticFiles(directory=str(static_dir), html=True), name="static_ui")

@app.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return RedirectResponse(url="/ui")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
