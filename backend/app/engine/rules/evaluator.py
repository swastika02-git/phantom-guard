from typing import List, Tuple
from app.schemas.analysis import ThreatFlagResponse
from .base import BaseRule
from .urgency import UrgencyRule
from .returns import GuaranteedReturnsRule
from .authority import BankingAuthorityRule
from .payment import PaymentPullRule
from .secrecy import SecrecyRule
from .shouting import ShoutingGremlinRule
from .hard_negatives import HardNegativeDampenerRule

class RuleEvaluator:
    def __init__(self):
        # Register standard rules
        self.rules: List[BaseRule] = [
            UrgencyRule(),
            GuaranteedReturnsRule(),
            BankingAuthorityRule(),
            PaymentPullRule(),
            SecrecyRule(),
            ShoutingGremlinRule(),
            HardNegativeDampenerRule(),
        ]

    def evaluate(self, text: str, language: str) -> Tuple[List[ThreatFlagResponse], int]:
        """
        Runs all registered rules against the input text.
        Returns:
            Tuple of (detected_flags, raw_rule_penalty)
        """
        flags: List[ThreatFlagResponse] = []
        total_penalty = 0

        for rule in self.rules:
            result = rule.evaluate(text, language)
            if result and result.matched:
                total_penalty += result.penalty
                # Dampener modifies score but is not surfaced as a red flag ghost
                if rule.rule_id != "hard_negative_dampener":
                    flags.append(
                        ThreatFlagResponse(
                            id=rule.rule_id,
                            ghost_id=rule.ghost_id,
                            ghost_name=rule.ghost_name,
                            name=rule.name,
                            explanation=result.explanation or rule.description,
                            severity=rule.severity,
                            evidence_span=result.evidence_span or "Pattern detected",
                            start_offset=result.start_offset,
                            end_offset=result.end_offset,
                        )
                    )

        # Penalty cannot be negative
        total_penalty = max(0, total_penalty)
        return flags, total_penalty

# Singleton evaluator instance
default_rule_evaluator = RuleEvaluator()
