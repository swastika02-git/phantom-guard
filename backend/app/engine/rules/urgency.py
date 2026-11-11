import re
from typing import Optional
from .base import BaseRule, RuleResult

URGENCY_PATTERNS = [
    # English patterns
    r"\b(immediately|urgent|urgently|within\s+\d+\s*(?:hours?|hrs?|mins?|minutes?)|action\s+required|last\s+chance|account\s+will\s+be\s+blocked\s+today|power\s+cut\s+tonight)\b",
    # Hinglish patterns
    r"\b(turant|jaldi|jaldi\s+karo|block\s+hone\s+wala\s+hai|band\s+ho\s+jayega|aaj\s+hi|abhi\s+karo|samapt\s+hone\s+wala|disconnect\s+hogi)\b",
    # Hindi Devanagari patterns
    r"(तुरंत|जल्दी\s+करें|तत्काल|आज\s+रात|बंद\s+होने\s+वाला|काट\s+दिया\s+जाएगा)",
]

COMBINED_URGENCY_REGEX = re.compile("|".join(URGENCY_PATTERNS), re.IGNORECASE)

class UrgencyRule(BaseRule):
    rule_id = "urgency_wraith"
    name = "Artificial Urgency & Pressure"
    description = "Threatens immediate negative consequences or time-limited action to rush the victim into a mistake."
    ghost_id = "urgency"
    ghost_name = "Urgency Wraith"
    severity = "high"
    base_penalty = 35

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        match = COMBINED_URGENCY_REGEX.search(text)
        if match:
            span_text = match.group(0).strip()
            return RuleResult(
                matched=True,
                evidence_span=span_text,
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="The message attempts to force immediate action by imposing an artificial deadline or threatening immediate disruption."
            )
        return None
