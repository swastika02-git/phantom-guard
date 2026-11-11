from typing import List, Tuple, Optional
from datetime import datetime, timezone
from app.schemas.analysis import (
    AnalyzeTextResponse,
    ThreatFlagResponse,
    VerdictLevel,
)

def aggregate_risk_assessment(
    text: str,
    language: str,
    flags: List[ThreatFlagResponse],
    rule_penalty: int,
    ml_probability: Optional[float] = None,
) -> AnalyzeTextResponse:
    """
    Combines rule engine penalties and optional ML probabilities into a final score (0-100).
    Enforces monotonicity: adding positive scam triggers never decreases the risk score.
    """
    # Baseline neutral score
    base_score = 10

    if ml_probability is not None:
        # Hybrid formula (experimental 45/55 weights)
        alpha = 0.45
        ml_score = ml_probability * 100
        raw_score = (alpha * ml_score) + ((1 - alpha) * (base_score + rule_penalty))
    else:
        # Phase 2 Pure Rule-Based Engine
        raw_score = base_score + rule_penalty

    # Hard floor: if critical flags exist, guarantee minimum threshold
    has_critical = any(f.severity == "critical" for f in flags)
    if has_critical and raw_score < 66:
        raw_score = max(raw_score, 68)

    # Hard clamp between 0 and 100
    final_score = int(round(min(100, max(0, raw_score))))

    # Verdict categorization
    if final_score > 65:
        verdict = "Likely a scam"
        verdict_level: VerdictLevel = "danger"
    elif final_score > 30:
        verdict = "Be careful"
        verdict_level: VerdictLevel = "warning"
    else:
        verdict = "Looks calm"
        verdict_level: VerdictLevel = "calm"

    # Contextual recommendations
    recommendations: List[str] = []
    flag_ids = {f.id for f in flags}

    if "guaranteed_returns" in flag_ids:
        recommendations.append("Check the SEBI public directory before investing in any scheme promising guaranteed profits.")
        recommendations.append("Never transfer funds to personal UPI IDs or Telegram group admins.")

    if "fake_authority" in flag_ids:
        recommendations.append("Indian banks never threaten immediate account deactivation via SMS or WhatsApp.")
        recommendations.append("Visit your official branch or use the verified banking mobile app to check KYC status.")

    if "payment_pull" in flag_ids:
        recommendations.append("Remember: Entering your UPI PIN is ONLY required to send money, never to receive money or cashback.")
        recommendations.append("Never pay upfront 'processing' or 'registration' fees for jobs or lottery claims.")

    if "urgency_wraith" in flag_ids:
        recommendations.append("Do not let artificial deadlines rush you. Pause, take a breath, and verify through official channels.")

    if not recommendations:
        if final_score <= 30:
            recommendations.append("No active scam indicators were detected in this message.")
            recommendations.append("Continue to practice standard caution and never share OTPs or passwords.")
        else:
            recommendations.append("Verify the sender's identity through an independent, official phone number.")

    confidence = 0.90 if len(flags) > 0 else 0.85

    return AnalyzeTextResponse(
        score=final_score,
        verdict=verdict,
        verdict_level=verdict_level,
        language=language,
        confidence=confidence,
        model_version="rule-engine-v1.0",
        analysis_status="success",
        flags=flags,
        recommendations=recommendations,
        disclaimer="This score is a probabilistic risk indicator, not a definitive legal determination. Please verify independently.",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
