from abc import ABC, abstractmethod
from typing import Optional, Literal
from pydantic import BaseModel

GhostType = Literal["urgency", "returns", "authority", "payment", "secrecy", "gremlin"]
SeverityLevel = Literal["low", "medium", "high", "critical"]

class RuleResult(BaseModel):
    matched: bool
    evidence_span: Optional[str] = None
    start_offset: Optional[int] = None
    end_offset: Optional[int] = None
    penalty: int = 0
    explanation: Optional[str] = None

class BaseRule(ABC):
    rule_id: str
    name: str
    description: str
    ghost_id: GhostType
    ghost_name: str
    severity: SeverityLevel
    base_penalty: int

    @abstractmethod
    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        """
        Evaluates input text against the specific heuristic pattern.
        Returns a RuleResult if triggered, or None if no threat indicator is present.
        """
        pass
