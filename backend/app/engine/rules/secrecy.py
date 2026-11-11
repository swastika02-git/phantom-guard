import re
from typing import Optional
from .base import BaseRule, RuleResult

SECRECY_PATTERNS = [
    # English patterns
    r"\b(do\s+not\s+(?:tell|inform|share\s+with)\s+(?:anyone|your\s+family|bank\s+officials)|strictly\s+confidential\s+task|keep\s+this\s+secret)\b",
    # Hinglish patterns
    r"\b(kisi\s+ko\s+mat\s+batana|ghar\s+walo\s+ko\s+mat\s+batao|kisi\s+se\s+share\s+mat\s+karo|gupt\s+rakho)\b",
    # Hindi Devanagari patterns
    r"(किसी\s+को\s+मत\s+बताना|परिवार\s+को\s+न\s+बताएं|गोपनीय\s+रखें)",
]

COMBINED_SECRECY_REGEX = re.compile("|".join(SECRECY_PATTERNS), re.IGNORECASE)

class SecrecyRule(BaseRule):
    rule_id = "secrecy_spook"
    name = "Isolation & Secrecy Tactics"
    description = "Instructs the recipient to keep the interaction secret from family or banking authorities to prevent outside intervention."
    ghost_id = "secrecy"
    ghost_name = "Secrecy Spook"
    severity = "medium"
    base_penalty = 25

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        match = COMBINED_SECRECY_REGEX.search(text)
        if match:
            span_text = match.group(0).strip()
            return RuleResult(
                matched=True,
                evidence_span=span_text,
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="Scammers often instruct victims to keep transactions confidential to prevent relatives or bank staff from intervening."
            )
        return None
