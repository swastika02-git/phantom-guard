import re
from typing import Optional
from .base import BaseRule, RuleResult

RETURNS_PATTERNS = [
    # English patterns
    r"\b(100%\s*guaranteed|guaranteed\s+returns?|double\s+your\s+money|risk\s*-?\s*free|daily\s+profit|daily\s+payouts?|assured\s+returns?|200%\s+profit)\b",
    # Hinglish patterns
    r"\b(paisa\s+double|paise\s+double|paishe\s+double|double\s+ho\s+jayega|guaranteed\s+return\s+hai|ghar\s+baithe\s+kamaye|rozana\s+kamaye|paisa\s+hi\s+paisa)\b",
    # Hindi Devanagari patterns
    r"(गारंटीड\s+रिटर्न|पैसा\s+डबल|दोगुना\s+हो\s+जाएगा|घर\s+बैठे\s+कमाएं|निश्चित\s+लाभ|बिना\s+जोखिम)",
]

COMBINED_RETURNS_REGEX = re.compile("|".join(RETURNS_PATTERNS), re.IGNORECASE)

class GuaranteedReturnsRule(BaseRule):
    rule_id = "guaranteed_returns"
    name = "Unrealistic Investment Promises"
    description = "Promises risk-free returns or guaranteed multi-fold investment multiplication, typical of Ponzi schemes."
    ghost_id = "returns"
    ghost_name = "Guaranteed-Returns Poltergeist"
    severity = "critical"
    base_penalty = 42

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        match = COMBINED_RETURNS_REGEX.search(text)
        if match:
            span_text = match.group(0).strip()
            return RuleResult(
                matched=True,
                evidence_span=span_text,
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="The message promises unrealistic or guaranteed financial gains. Legitimate financial investments subject to market risk never promise guaranteed multiplication."
            )
        return None
