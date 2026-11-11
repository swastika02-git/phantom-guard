import re
from typing import Optional
from .base import BaseRule, RuleResult

PAYMENT_PATTERNS = [
    # English patterns
    r"\b((?:pay|send|deposit)\s+(?:rs\.?|inr|₹)\s*\d+|registration\s+fees?|processing\s+charges?|activation\s+fee|scan\s+(?:this\s+)?qr\s+to\s+receive|enter\s+upi\s+pin\s+to\s+credit)\b",
    # Hinglish patterns
    r"\b(registration\s+fee\s+(?:bhejo|karo|do)|paise\s+bhejo|pehle\s+₹\s*\d+\s+pay\s+karo|advance\s+fee|qr\s+scan\s+karke\s+paise\s+lo)\b",
    # Hindi Devanagari patterns
    r"(रजिस्ट्रेशन\s+फीस|पंजीकरण\s+शुल्क|पैसे\s+भेजें|क्यूआर\s+कोड\s+स्कैन\s+करें|एडवांस\s+चार्ज)",
]

COMBINED_PAYMENT_REGEX = re.compile("|".join(PAYMENT_PATTERNS), re.IGNORECASE)

class PaymentPullRule(BaseRule):
    rule_id = "payment_pull"
    name = "Suspicious Upfront Fee & UPI Request"
    description = "Requests upfront registration or activation fees, or deceptive UPI/QR actions to steal funds."
    ghost_id = "payment"
    ghost_name = "Payment-Pull Banshee"
    severity = "high"
    base_penalty = 30

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        match = COMBINED_PAYMENT_REGEX.search(text)
        if match:
            span_text = match.group(0).strip()
            return RuleResult(
                matched=True,
                evidence_span=span_text,
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="The message requests an upfront registration fee or suspicious payment transfer to unlock a prize, job, or loan."
            )
        return None
