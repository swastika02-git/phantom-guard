import re
from typing import Optional
from .base import BaseRule, RuleResult

EXCLAMATION_REGEX = re.compile(r"!{3,}")

class ShoutingGremlinRule(BaseRule):
    rule_id = "shouting_gremlin"
    name = "Aggressive Shouting & Formatting"
    description = "Uses excessive capitalisation and exclamation marks to simulate extreme importance or alarm."
    ghost_id = "gremlin"
    ghost_name = "Shouting Gremlin"
    severity = "low"
    base_penalty = 18

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        # Exclamation spam
        exclamation_match = EXCLAMATION_REGEX.search(text)
        if exclamation_match:
            return RuleResult(
                matched=True,
                evidence_span=exclamation_match.group(0),
                start_offset=exclamation_match.start(),
                end_offset=exclamation_match.end(),
                penalty=self.base_penalty,
                explanation="The message uses excessive exclamation marks to create artificial dramatic alarm."
            )

        # All-caps checking for Romanized text
        alpha_chars = [c for c in text if c.isalpha()]
        if len(alpha_chars) >= 30:
            upper_count = sum(1 for c in alpha_chars if c.isupper())
            ratio = upper_count / len(alpha_chars)
            if ratio >= 0.50:
                # Find first uppercase run
                first_caps = re.search(r"[A-Z\s]{10,}", text)
                span = first_caps.group(0).strip() if first_caps else text[:30]
                return RuleResult(
                    matched=True,
                    evidence_span=span,
                    penalty=self.base_penalty,
                    explanation="Over half of the text is in ALL-CAPS, a common tactic used to simulate authority and heighten panic."
                )

        return None
