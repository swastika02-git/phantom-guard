import re
from typing import Optional
from .base import BaseRule, RuleResult

# Legitimate service alert indicators commonly used by Indian banks and couriers
LEGITIMATE_BANK_PATTERNS = [
    r"\b(?:debited|credited)\s+for\s+(?:rs\.?|inr|₹)\s*[\d,]+(?:\.\d{2})?\b",
    r"\bnot\s+you\?\s*(?:sms|call|report)\b",
    r"\bnever\s+share\s+your\s+(?:otp|pin|password)\s+with\s+anyone\b",
    r"\botp\s+is\s+secret\b",
    r"\bout\s+for\s+delivery\s+with\s+(?:agent|courier|rider)\b",
    r"\bshare\s+otp\s+only\s+(?:upon|after)\s+receiving\b",
]

SUSPICIOUS_LINK_REGEX = re.compile(r"https?://|bit\.ly|tinyurl|\.top/|\.xyz/|\.apk\b", re.IGNORECASE)
COMBINED_LEGITIMATE_REGEX = re.compile("|".join(LEGITIMATE_BANK_PATTERNS), re.IGNORECASE)

class HardNegativeDampenerRule(BaseRule):
    rule_id = "hard_negative_dampener"
    name = "Verified Genuine Alert Structure"
    description = "Recognizes authentic institutional formats (e.g. real bank debit SMS, verified delivery OTPs) and dampens false alarms."
    ghost_id = "authority"
    ghost_name = "Protective Verifier"
    severity = "low"
    base_penalty = -30  # Score dampener

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        # If the message contains an external link, do NOT dampen (phishing campaigns often mimic bank footers)
        if SUSPICIOUS_LINK_REGEX.search(text):
            return None

        match = COMBINED_LEGITIMATE_REGEX.search(text)
        if match:
            return RuleResult(
                matched=True,
                evidence_span=match.group(0),
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="The message structure matches verified standard banking or courier transaction alerts."
            )
        return None
