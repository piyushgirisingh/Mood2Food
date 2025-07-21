import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_classify_emotion(client):
    response = client.post("/classify-emotion", json={"reason": "I ate cookies because I felt anxious"})
    assert response.status_code == 200
    data = response.get_json()
    assert "emotion" in data
    assert "confidence" in data

def test_feedback_submission(client):
    payload = {
        "original_text": "I felt sad",
        "emotion": "sadness",
        "bot_reply": "I’m here for you",
        "user_feedback": "helpful",
        "user_comment": "Thanks"
    }
    response = client.post("/feedback", json=payload)
    assert response.status_code == 200
    assert "message" in response.get_json()

def test_feedback_history(client):
    response = client.get("/feedback/history")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)