import logging
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, status
from app.schemas.url import AnalyzeURLRequest, AnalyzeURLResponse
from app.engine.url.heuristics import analyze_url_offline

logger = logging.getLogger("phantom_guard.api")
router = APIRouter(prefix="/analyze", tags=["URL Analysis"])

@router.post(
    "/url",
    response_model=AnalyzeURLResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze suspicious website URL",
    description="Inspects user-submitted URLs using offline syntactic heuristics without opening or requesting the remote website (SSRF-proof)."
)
async def analyze_url(request: AnalyzeURLRequest) -> AnalyzeURLResponse:
    raw_url = request.url.strip()
    if not raw_url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="URL cannot be empty."
        )

    # Perform offline inspection
    result = analyze_url_offline(raw_url)

    # Privacy-conscious safe logging (domain only, no sensitive query parameters)
    try:
        domain = urlparse(raw_url if "://" in raw_url else "http://" + raw_url).netloc
    except Exception:
        domain = "unknown"

    logger.info(
        f"[AUDIT] URL evaluated offline: domain={domain}, indicators={len(result.indicators)}, score={result.score}, verdict={result.verdict}"
    )

    return result
