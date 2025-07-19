from flask import Flask, request, jsonify
from emotion_model import analyze_emotion
import pandas as pd
import os
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Log file path
LOG_FILE = "logs.csv"

# Create logs.csv if it doesn't exist
if not os.path.exists(LOG_FILE):
    df = pd.DataFrame(columns=["timestamp", "text", "emotion", "confidence"])
    df.to_csv(LOG_FILE, index=False)

@app.route("/")
def home():
    return " Mood2Food Emotion Classifier is running!"

@app.route("/classify-emotion", methods=["POST"])
def classify():
    try:
        # Parse JSON request
        data = request.get_json()
        reason = data.get("reason", "")

        if not reason:
            return jsonify({"error": "Missing 'reason' field"}), 400

        # Analyze emotion using Hugging Face model
        emotion, confidence = analyze_emotion(reason)

        # Log to CSV
        df = pd.read_csv(LOG_FILE)
        df.loc[len(df)] = [datetime.now().isoformat(), reason, emotion, confidence*100]
        df.to_csv(LOG_FILE, index=False)

        # Return JSON response
        return jsonify({
            "emotion": emotion,
            "confidence": confidence*100,
            "insight": f"This seems to be emotional eating triggered by {emotion.lower()}."
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)