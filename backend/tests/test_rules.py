import pytest
from app.engine.language import identify_language
from app.engine.rules.evaluator import default_rule_evaluator

def test_language_detection():
    assert identify_language("Hello friend, how are you today?") == "en"
    assert identify_language("Aapka account block hone wala hai turant KYC complete karo") == "hinglish"
    assert identify_language("घर बैठे यूट्यूब वीडियो लाइक करके रोज़ाना ₹3000 कमाएं") == "hi"

def test_urgency_rule():
    text = "Action required: Your account will be blocked within 2 hours unless verified."
    flags, penalty = default_rule_evaluator.evaluate(text, "en")
    flag_ids = [f.id for f in flags]
    assert "urgency_wraith" in flag_ids
    assert penalty >= 35

def test_guaranteed_returns_hinglish():
    text = "Sir investment double ho jayega guaranteed return hai! VIP group join karo."
    flags, penalty = default_rule_evaluator.evaluate(text, "hinglish")
    flag_ids = [f.id for f in flags]
    assert "guaranteed_returns" in flag_ids
    assert any(f.ghost_id == "returns" for f in flags)

def test_banking_authority_hindi():
    text = "प्रिय ग्राहक, आपका बैंक खाता ब्लॉक होने वाला है, तुरंत पैन कार्ड लिंक करें।"
    flags, penalty = default_rule_evaluator.evaluate(text, "hi")
    flag_ids = [f.id for f in flags]
    assert "fake_authority" in flag_ids

def test_payment_pull_rule():
    text = "Congratulations you won prize! Send Rs 500 registration fee to claim your cash."
    flags, penalty = default_rule_evaluator.evaluate(text, "en")
    flag_ids = [f.id for f in flags]
    assert "payment_pull" in flag_ids

def test_secrecy_rule():
    text = "Yeh task strictly confidential hai, kisi ko mat batana varna contract cancel ho jayega."
    flags, penalty = default_rule_evaluator.evaluate(text, "hinglish")
    flag_ids = [f.id for f in flags]
    assert "secrecy_spook" in flag_ids

def test_shouting_gremlin():
    text = "URGENT ALERT PLEASE RESPOND RIGHT NOW TO AVOID PERMANENT TERMINATION OF YOUR SERVICE"
    flags, _ = default_rule_evaluator.evaluate(text, "en")
    flag_ids = [f.id for f in flags]
    assert "shouting_gremlin" in flag_ids

def test_hard_negative_dampener():
    text = "HDFC Bank: Rs 540.00 debited from A/c **4921 for Swiggy. Not you? SMS BLOCK to 5676712. Never share your OTP with anyone."
    flags, penalty = default_rule_evaluator.evaluate(text, "en")
    # Legitimate format should have low or 0 net penalty
    assert penalty == 0
    assert len(flags) == 0
