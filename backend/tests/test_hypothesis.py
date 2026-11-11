from hypothesis import given, strategies as st
from app.engine.language import identify_language
from app.engine.rules.evaluator import default_rule_evaluator
from app.engine.aggregator import aggregate_risk_assessment

@given(st.text(min_size=1, max_size=500))
def test_score_boundaries_arbitrary_text(random_text: str):
    """
    Property: For any arbitrary generated string, the risk score MUST always stay between 0 and 100.
    """
    clean_text = random_text.strip()
    if not clean_text:
        return

    lang = identify_language(clean_text)
    flags, penalty = default_rule_evaluator.evaluate(clean_text, lang)
    response = aggregate_risk_assessment(clean_text, lang, flags, penalty)

    assert 0 <= response.score <= 100
    assert response.verdict_level in ["calm", "warning", "danger"]

@given(st.text(min_size=1, max_size=300))
def test_guaranteed_returns_monotonicity(base_text: str):
    """
    Property: Adding a guaranteed-returns scam phrase to any message must NEVER reduce the risk score.
    Score(M + " 100% guaranteed return paisa double") >= Score(M)
    """
    clean_text = base_text.strip()
    if not clean_text:
        return

    # Base evaluation
    lang_base = identify_language(clean_text)
    flags_base, penalty_base = default_rule_evaluator.evaluate(clean_text, lang_base)
    resp_base = aggregate_risk_assessment(clean_text, lang_base, flags_base, penalty_base)

    # Augmented evaluation
    augmented_text = clean_text + " 100% guaranteed return paisa double"
    lang_aug = identify_language(augmented_text)
    flags_aug, penalty_aug = default_rule_evaluator.evaluate(augmented_text, lang_aug)
    resp_aug = aggregate_risk_assessment(augmented_text, lang_aug, flags_aug, penalty_aug)

    assert resp_aug.score >= resp_base.score
