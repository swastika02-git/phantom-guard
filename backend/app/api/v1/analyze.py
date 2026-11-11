import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.analysis import AnalyzeTextRequest, AnalyzeTextResponse
from app.engine.language import identify_language
from app.engine.rules.evaluator import default_rule_evaluator
from app.engine.aggregator import aggregate_risk_assessment

logger = logging.getLogger("phantom_guard.api")
router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.post(
    "/text",
    response_model=AnalyzeTextResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze suspicious message text",
    description="Analyzes message content in English, Hindi, or Hinglish using the hybrid detection engine."
)
async def analyze_text(request: AnalyzeTextRequest) -> AnalyzeTextResponse:
    content = request.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Content cannot be empty or purely whitespace."
        )

    # 1. Identify input language
    language = identify_language(content)

    # 2. Evaluate modular rules
    flags, rule_penalty = default_rule_evaluator.evaluate(content, language)

    # 3. Aggregate risk score
    response = aggregate_risk_assessment(
        text=content,
        language=language,
        flags=flags,
        rule_penalty=rule_penalty,
    )

    # Privacy-conscious logging: Never logs raw user message content
    logger.info(
        f"[AUDIT] Text analyzed: lang={language}, flags={len(flags)}, score={response.score}, verdict={response.verdict}"
    )

    return response
