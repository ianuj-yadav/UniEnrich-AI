from fastapi import APIRouter
from app.api.v1 import upload, enrich, products, review, analytics, export

api_router = APIRouter()
api_router.include_router(upload.router, tags=["Upload"])
api_router.include_router(enrich.router, tags=["Enrichment"])
api_router.include_router(products.router, tags=["Products"])
api_router.include_router(review.router, tags=["Human Review"])
api_router.include_router(analytics.router, tags=["Analytics"])
api_router.include_router(export.router, tags=["Export"])
