import re
from typing import Optional
from .base import BaseRule, RuleResult

AUTHORITY_PATTERNS = [
    # English patterns
    r"\b((?:update|verify)\s+your\s+kyc|kyc\s+expired|account\s+has\s+been\s+suspended|electricity\s+power\s+will\s+be\s+disconnected|cbi\s+investigation|customs\s+clearance\s+fee|rbi\s+mandate)\b",
    # Hinglish patterns
    r"\b(kyc\s+(?:turant|immediately|complete|karo|karein)|account\s+block\s+hone\s+wala|pan\s+card\s+link\s+karo|bijli\s+cut\s+jayegi|sbi\s+kyc|bank\s+khata\s+band)\b",
    # Hindi Devanagari patterns
    r"(केवाईसी\s+अपडेट|खाता\s+ब्लॉक\s+हो\s+जाएगा|बिजली\s+काट\s+दी\s+जाएगी|पैन\s+कार्ड\s+लिंक|बैंक\s+अधिकारी)",
]

COMBINED_AUTHORITY_REGEX = re.compile("|".join(AUTHORITY_PATTERNS), re.IGNORECASE)

class BankingAuthorityRule(BaseRule):
    rule_id = "fake_authority"
    name = "Institutional & KYC Impersonation"
    description = "Impersonates banks, utility companies, or law enforcement to extract personal credentials or coerce compliance."
    ghost_id = "authority"
    ghost_name = "Fake-Authority Phantom"
    severity = "critical"
    base_penalty = 38

    def evaluate(self, text: str, language: str) -> Optional[RuleResult]:
        match = COMBINED_AUTHORITY_REGEX.search(text)
        if match:
            span_text = match.group(0).strip()
            return RuleResult(
                matched=True,
                evidence_span=span_text,
                start_offset=match.start(),
                end_offset=match.end(),
                penalty=self.base_penalty,
                explanation="The message impersonates a bank, utility provider, or regulatory body regarding KYC or account suspension."
            )
        return None
