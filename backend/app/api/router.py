from fastapi import APIRouter
from app.api.v1.analyze import router as analyze_router
from app.api.v1.url import router as url_router
from app.api.v1.image import router as image_router
from app.api.v1.health import router as health_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(analyze_router)
api_router.include_router(url_router)
api_router.include_router(image_router)
api_router.include_router(health_router)
