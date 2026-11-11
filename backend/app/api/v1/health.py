from datetime import datetime, timezone
from fastapi import APIRouter
from app.schemas.analysis import HealthResponse
from app.engine.rules.evaluator import default_rule_evaluator
from app.engine.ml.classifier import ml_classifier

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        version="0.3.0-phase3",
        rules_loaded=len(default_rule_evaluator.rules),
        ml_loaded=ml_classifier.is_loaded,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
