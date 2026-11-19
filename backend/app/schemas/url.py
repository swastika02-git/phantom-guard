from typing import List, Literal
from pydantic import BaseModel, Field

SeverityLevel = Literal["low", "medium", "high", "critical"]
VerdictLevel = Literal["calm", "warning", "danger"]

class AnalyzeURLRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="User-submitted URL to evaluate using offline security heuristics"
    )

class URLIndicator(BaseModel):
    type: str = Field(..., description="Machine identifier for the heuristic indicator")
    name: str = Field(..., description="Human-readable title")
    description: str = Field(..., description="Explanation of why this pattern is suspicious")
    severity: SeverityLevel = Field(..., description="Severity rating")
    evidence: str = Field(..., description="Matched token, domain, or structural characteristic")

class AnalyzeURLResponse(BaseModel):
    url: str = Field(..., description="Evaluated URL")
    score: int = Field(..., ge=0, le=100, description="Phishing risk score (0-100)")
    verdict: str = Field(..., description="Risk verdict")
    verdict_level: VerdictLevel = Field(..., description="Visual styling level: calm, warning, danger")
    indicators: List[URLIndicator] = Field(default_factory=list, description="List of detected heuristic indicators")
    safe_inspection_note: str = Field(
        "This evaluation was executed strictly offline using syntactic security heuristics. The remote host was never contacted.",
        description="SSRF protection notice"
    )
    timestamp: str = Field(..., description="Evaluation timestamp (ISO 8601)")
