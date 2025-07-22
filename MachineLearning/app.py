from flask import Flask, request, jsonify
from emotion_model import analyze_emotion
import pandas as pd
import os
import logging
from datetime import datetime
from collections import Counter
import numpy as np
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize Flask app
app = Flask(__name__)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"]
)

# Log file path
LOG_FILE = "logs.csv"
FEEDBACK_CSV_PATH = "feedback_logs.csv"

# Create logs.csv if it doesn't exist
if not os.path.exists(LOG_FILE):
    df = pd.DataFrame(columns=["timestamp", "text", "emotion", "confidence"])
    df.to_csv(LOG_FILE, index=False)

# Setup error log file
logging.basicConfig(filename="error.log", level=logging.ERROR)


@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
    return jsonify({"error": "Internal server error"}), 500


@app.route("/")
def home():
    return " Mood2Food Emotion Classifier is running!"


@app.route("/classify-emotion", methods=["POST"])
@limiter.limit("10 per minute")
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
        df.loc[len(df)] = [datetime.now().isoformat(),
                           reason, emotion, confidence*100]
        df.to_csv(LOG_FILE, index=False)

        # Return JSON response
        return jsonify({
            "emotion": emotion,
            "confidence": confidence*100,
            "insight": f"This seems to be emotional eating triggered by {emotion.lower()}."
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/patterns", methods=["GET"])
@limiter.limit("10 per minute")
def get_patterns():
    try:
        if not os.path.exists(LOG_FILE):
            return jsonify({"message": "No logs found yet."})

        df = pd.read_csv(LOG_FILE)

        if df.empty:
            return jsonify({"message": "Log file is empty."})

        # Convert timestamp to datetime and filter for last 7 days
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        last_7_days = df[df["timestamp"] >=
                         pd.Timestamp.now() - pd.Timedelta(days=7)]

        if last_7_days.empty:
            return jsonify({"message": "No logs from the last 7 days."})

        # Extract hour and day
        last_7_days["hour"] = last_7_days["timestamp"].dt.strftime(
            "%I %p")  # 12-hour format
        last_7_days["day_of_week"] = last_7_days["timestamp"].dt.day_name()

        # Most common emotion, hour, and day
        top_emotion = last_7_days["emotion"].value_counts().idxmax()
        common_hour = last_7_days["hour"].mode()[0]
        common_day = last_7_days["day_of_week"].mode()[0]

        # Insight message
        insight = f"You most often experienced {top_emotion.lower()} around {common_hour} on {common_day}s this week."

        return jsonify({
            "top_emotion": top_emotion,
            "common_hour": common_hour,
            "common_day": common_day,
            "insight": insight
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/logs/summary", methods=["GET"])
def summary():
    try:
        df = pd.read_csv(LOG_FILE)

        if df.empty:
            return jsonify({"message": "No logs available yet"}), 200

        df["timestamp"] = pd.to_datetime(df["timestamp"])
        now = pd.Timestamp.now()
        week_ago = now - pd.Timedelta(days=7)
        recent_df = df[df["timestamp"] >= week_ago]

        # Most frequent emotion this week
        most_common_emotion = recent_df["emotion"].mode(
        ).iloc[0] if not recent_df.empty else None

        # Weekly log count
        weekly_log_count = len(recent_df)

        # Mood trend: count of each emotion
        mood_trend = recent_df["emotion"].value_counts().to_dict()

        # Most common eating hour (12-hour format with AM/PM)
        df["ampm"] = df["timestamp"].dt.strftime("%I %p")
        peak_hour = df["ampm"].mode().iloc[0]

        return jsonify({
            "most_common_emotion": most_common_emotion,
            "weekly_log_count": weekly_log_count,
            "mood_trend": mood_trend,
            "peak_hour": peak_hour
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/feedback", methods=["POST"])
@limiter.limit("5 per minute")
def feedback():
    try:
        data = request.get_json()

        original_text = data.get("original_text", "")
        emotion = data.get("emotion", "")
        bot_reply = data.get("bot_reply", "")
        user_feedback = data.get("user_feedback", "")
        user_comment = data.get("user_comment", "")

        # Load existing or create new DataFrame
        if os.path.exists(FEEDBACK_CSV_PATH):
            df = pd.read_csv(FEEDBACK_CSV_PATH)
        else:
            df = pd.DataFrame(columns=["timestamp", "original_text",
                              "emotion", "bot_reply", "user_feedback", "user_comment"])

        # Append new feedback
        df.loc[len(df)] = [
            datetime.now().isoformat(),
            original_text,
            emotion,
            bot_reply,
            user_feedback,
            user_comment
        ]

        # Save updated DataFrame
        df.to_csv(FEEDBACK_CSV_PATH, index=False)

        return jsonify({"message": "Feedback saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/feedback/history", methods=["GET"])
def get_feedback_history():
    try:
        df = pd.read_csv(FEEDBACK_CSV_PATH)

        # Drop rows where user_feedback is missing or empty
        df = df.dropna(subset=["user_feedback"])
        df = df[df["user_feedback"].str.strip() != ""]

        # Optional: Drop rows where original_text is missing
        df = df.dropna(subset=["original_text"])
        df = df[df["original_text"].str.strip() != ""]

        # Sort by timestamp descending (most recent first)
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df.sort_values(by="timestamp", ascending=False)

        return jsonify(df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/insights", methods=["GET"])
def generate_insights():
    try:
        df = pd.read_csv(LOG_FILE)

        # Drop missing rows
        df = df.dropna(subset=["timestamp", "emotion"])

        # Convert timestamp to datetime and extract hour
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df["hour"] = df["timestamp"].dt.hour
        df["period"] = df["hour"].apply(
            lambda x: f"{(x % 12) or 12}{'AM' if x < 12 else 'PM'}")

        # Get most common emotion
        most_common_emotion = df["emotion"].mode()[0]

        # Get most common hour (in 12-hour format)
        common_hour = df["period"].mode()[0]

        # Emotion frequency
        emotion_counts = df["emotion"].value_counts()
        emotion_summary = [
            f"{emotion}: {count} times" for emotion, count in emotion_counts.items()]

        # Total emotional eating logs
        total_logs = len(df)

        insights = {
            "summary": [
                f"Your most frequent emotion was {most_common_emotion}.",
                f"Emotional eating most often occurred around {common_hour}.",
                f"You’ve logged emotional eating {total_logs} times.",
            ],
            "breakdown": emotion_summary
        }

        return jsonify(insights)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error="Too many requests, please slow down."), 429


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
