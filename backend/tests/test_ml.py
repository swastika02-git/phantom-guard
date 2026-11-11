import pytest
from app.engine.ml.classifier import ml_classifier
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_ml_model_loaded():
    assert ml_classifier.is_loaded is True
    assert ml_classifier.vectorizer is not None
    assert ml_classifier.classifier is not None

def test_ml_prediction_scam():
    text = "Sir investment double ho jayega guaranteed return hai VIP group join karo"
    prob = ml_classifier.predict_scam_probability(text)
    assert prob is not None
    assert 0.0 <= prob <= 1.0
    # Obvious scam should have higher scam probability
    assert prob > 0.50

def test_ml_prediction_legitimate():
    text = "Meeting ka schedule kal subah 10 baje rakhte hain, sab log time se aa jana please."
    prob = ml_classifier.predict_scam_probability(text)
    assert prob is not None
    assert 0.0 <= prob <= 1.0
    # Ordinary peer chat should have lower scam probability
    assert prob < 0.50

def test_hybrid_scoring_in_api():
    payload = {
        "content": "Aapka account block hone wala hai KYC immediately complete karo: http://sbi.top",
        "source_hint": "sms"
    }
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["model_version"] == "hybrid-baseline-v1.0"
    assert data["score"] >= 65
    assert data["verdict_level"] == "danger"
