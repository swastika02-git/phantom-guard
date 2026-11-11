from typing import List, Optional, Literal
from pydantic import BaseModel, Field

VerdictLevel = Literal["calm", "warning", "danger"]
GhostType = Literal["urgency", "returns", "authority", "payment", "secrecy", "gremlin"]
SeverityLevel = Literal["low", "medium", "high", "critical"]

class AnalyzeTextRequest(BaseModel):
    content: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Text content of the suspicious message (English, Hindi, or Hinglish)"
    )
    source_hint: Optional[str] = Field(
        "sms",
        description="Source platform hint (sms, whatsapp, telegram, email)"
    )

class ThreatFlagResponse(BaseModel):
    id: str = Field(..., description="Unique rule identifier")
    ghost_id: GhostType = Field(..., description="Mapped ghost persona identifier")
    ghost_name: str = Field(..., description="Display name of the ghost")
    name: str = Field(..., description="Human-readable threat category")
    explanation: str = Field(..., description="Simple, non-technical explanation")
    severity: SeverityLevel = Field(..., description="Severity weight")
    evidence_span: str = Field(..., description="Exact textual excerpt triggering the flag")
    start_offset: Optional[int] = Field(None, description="Starting character offset in text")
    end_offset: Optional[int] = Field(None, description="Ending character offset in text")

class AnalyzeTextResponse(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Calibrated scam risk score (0-100)")
    verdict: str = Field(..., description="Plain-language risk verdict")
    verdict_level: VerdictLevel = Field(..., description="Visual styling level: calm, warning, danger")
    language: str = Field(..., description="Detected language code: en, hi, hinglish")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    model_version: str = Field(..., description="Active engine or model version string")
    analysis_status: str = Field("success", description="Status of the analysis")
    flags: List[ThreatFlagResponse] = Field(default_factory=list, description="Detected red flag ghosts")
    recommendations: List[str] = Field(default_factory=list, description="Recommended safe actions")
    disclaimer: str = Field(
        "This score is a probabilistic risk indicator, not a definitive legal determination. Please verify independently.",
        description="Responsible AI safety disclaimer"
    )
    timestamp: str = Field(..., description="ISO 8601 evaluation timestamp")

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.2.0-phase2"
    rules_loaded: int
    ml_loaded: bool
    timestamp: str
