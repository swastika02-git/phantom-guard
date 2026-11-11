from datetime import datetime, timezone
from fastapi import APIRouter
from app.schemas.analysis import HealthResponse
from app.engine.rules.evaluator import default_rule_evaluator

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        version="0.2.0-phase2",
        rules_loaded=len(default_rule_evaluator.rules),
        ml_loaded=False,  # Phase 3 will set this to True once model is trained
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
