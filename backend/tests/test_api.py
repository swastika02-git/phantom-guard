from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["rules_loaded"] >= 6

def test_analyze_text_scam_hinglish():
    payload = {
        "content": "Aapka account block hone wala hai KYC immediately complete karo: http://sbi.top",
        "source_hint": "sms"
    }
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] >= 65
    assert data["verdict"] == "Likely a scam"
    assert data["verdict_level"] == "danger"
    assert data["language"] == "hinglish"
    assert len(data["flags"]) >= 1

def test_analyze_text_genuine_bank():
    payload = {
        "content": "Bluedart: Your shipment #849201 is out for delivery with agent Ramesh. Share OTP 4821 only upon receiving.",
        "source_hint": "sms"
    }
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] <= 30
    assert data["verdict"] == "Looks calm"
    assert data["verdict_level"] == "calm"

def test_empty_content_validation():
    payload = {"content": "   "}
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 422

def test_oversized_content_validation():
    payload = {"content": "A" * 2001}
    response = client.post("/api/v1/analyze/text", json=payload)
    assert response.status_code == 422
