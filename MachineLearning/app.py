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
from dotenv import load_dotenv
import os
from openai import AzureOpenAI
import json
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from transformers import pipeline
import openai
from dotenv import load_dotenv
import numpy as np
from collections import defaultdict
import pickle
from fun_facts_service import FunFactsService

load_dotenv()  # 👈 This loads your .env file

# Initialize AzureOpenAI client (required for Dallas AI proxy)
openai_client = AzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2024-02-01"
)

# Debug print (optional)
print("API KEY:", os.getenv("OPENAI_API_KEY"))
print("API BASE:", os.getenv("OPENAI_API_BASE"))

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
    df = pd.DataFrame(columns=["timestamp", "text", "emotion", "confidence", "user_id"])
    df.to_csv(LOG_FILE, index=False)

# Setup error log file
logging.basicConfig(filename="error.log", level=logging.ERROR)



def generate_openai_response(user_message, emotion, confidence):
    """Generate an OpenAI response for emotional eating support using AzureOpenAI"""
    try:
        print(f"DEBUG: Using AzureOpenAI for EMOTIONAL eating - emotion '{emotion}' with {confidence:.1f}% confidence")
        
        system_prompt = f"""You are an emotional eating support specialist for the Mood2Food app. The user is experiencing '{emotion}' emotion with {confidence:.1f}% confidence.

Your role: Help users identify emotional eating patterns, provide healthier coping strategies, and offer encouragement.

If they mention food/eating: Address the emotional trigger and suggest alternatives.
If they're celebrating: Suggest non-food ways to celebrate.
If they're stressed/sad: Offer comfort strategies that don't involve food.

Always be empathetic, non-judgmental, and focus on building awareness of eating patterns.
Keep responses under 100 words and actionable."""

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        print(f"DEBUG: AzureOpenAI EMOTIONAL SUCCESS: {content[:50]}...")
        return content
        
    except Exception as e:
        print(f"AzureOpenAI Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None


def generate_practical_response(user_message):
    """Generate a practical nutrition/wellness response for non-emotional food questions"""
    try:
        print(f"DEBUG: Using AzureOpenAI for PRACTICAL question")
        
        system_prompt = """You are a helpful nutrition and wellness assistant for the Mood2Food app. The user is asking a practical question about food, drinks, or eating habits.

Your role: Provide helpful, practical advice about nutrition, hydration, meal timing, and healthy choices.

- If they ask about drinks: Suggest healthy alternatives and explain benefits
- If they ask about hunger/timing: Give practical advice about meals and snacks
- If they ask about specific foods: Provide balanced nutrition information
- Be supportive and informative without assuming emotional issues

Keep responses under 100 words, practical, and friendly."""

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        print(f"DEBUG: AzureOpenAI PRACTICAL SUCCESS: {content[:50]}...")
        return content
        
    except Exception as e:
        print(f"AzureOpenAI Practical Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None


def generate_openai_response_with_history(user_message, emotion, confidence, conversation_history, user_id):
    """Generate an OpenAI response with conversation history, pattern awareness, and reinforcement learning"""
    try:
        print(f"DEBUG: Using AzureOpenAI for EMOTIONAL eating with HISTORY - emotion '{emotion}' with {confidence:.1f}% confidence")
        
        # Analyze conversation patterns
        patterns = analyze_conversation_patterns(conversation_history)
        
        # Get reinforcement learning context
        rl_context = rl_system.get_adaptive_response_context(user_id, emotion)
        
        # Build context-aware system prompt
        history_context = ""
        if conversation_history:
            recent_messages = conversation_history[:6]  # Last 6 messages for context
            history_context = "\n\nRecent conversation context:\n"
            for msg in reversed(recent_messages):  # Show in chronological order
                history_context += f"{msg['sender']}: {msg['message']}\n"
        
        pattern_context = ""
        if patterns:
            pattern_context = f"\n\nUser's patterns you've noticed:\n"
            if patterns.get('common_triggers'):
                pattern_context += f"- Common emotional triggers: {', '.join(patterns['common_triggers'])}\n"
            if patterns.get('eating_mentions'):
                pattern_context += f"- Often mentions food when: {', '.join(patterns['eating_mentions'])}\n"
            if patterns.get('coping_strategies'):
                pattern_context += f"- Responded well to: {', '.join(patterns['coping_strategies'])}\n"
        
        # Add reinforcement learning insights
        learning_context = ""
        if rl_context:
            learning_context = f"\n\nReinforcement Learning Insights:{rl_context}"
        
        system_prompt = f"""You are an emotional eating support specialist for the Mood2Food app. The user is experiencing '{emotion}' emotion with {confidence:.1f}% confidence.

Your role: Help users identify emotional eating patterns, provide healthier coping strategies, and offer encouragement. You remember past conversations and can reference previous discussions to provide personalized support.

IMPORTANT: Use the conversation history, patterns, and learning insights to provide personalized, context-aware responses. Reference previous conversations when relevant, acknowledge patterns you've noticed, and build on past discussions.{history_context}{pattern_context}{learning_context}

If they mention food/eating: Address the emotional trigger and suggest alternatives.
If they're celebrating: Suggest non-food ways to celebrate.
If they're stressed/sad: Offer comfort strategies that don't involve food.

Always be empathetic, non-judgmental, and focus on building awareness of eating patterns.
Keep responses under 120 words and actionable."""

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=180,
            temperature=0.7
        )
        
        content = response.choices[0].message.content.strip()
        print(f"DEBUG: AzureOpenAI CONTEXTUAL SUCCESS: {content[:50]}...")
        return content
        
    except Exception as e:
        print(f"AzureOpenAI Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return None


def analyze_conversation_patterns(conversation_history):
    """Analyze conversation history to identify patterns and triggers"""
    if not conversation_history:
        return {}
    
    patterns = {
        'common_triggers': [],
        'eating_mentions': [],
        'coping_strategies': []
    }
    
    # Keywords for pattern recognition
    trigger_words = ['stressed', 'sad', 'angry', 'anxious', 'tired', 'lonely', 'bored', 'frustrated', 'overwhelmed']
    food_context_words = ['eat', 'food', 'hungry', 'craving', 'snack', 'meal', 'comfort food']
    coping_words = ['walk', 'breathe', 'journal', 'music', 'call', 'exercise', 'meditate', 'tea']
    
    user_messages = [msg for msg in conversation_history if msg['sender'] == 'USER']
    bot_messages = [msg for msg in conversation_history if msg['sender'] == 'BOT']
    
    # Analyze triggers
    for msg in user_messages:
        message_lower = msg['message'].lower()
        for trigger in trigger_words:
            if trigger in message_lower and trigger not in patterns['common_triggers']:
                patterns['common_triggers'].append(trigger)
        
        # Check for food mentions with emotional context
        if any(food_word in message_lower for food_word in food_context_words):
            if any(trigger in message_lower for trigger in trigger_words):
                context = f"emotional {[t for t in trigger_words if t in message_lower][0]} eating"
                if context not in patterns['eating_mentions']:
                    patterns['eating_mentions'].append(context)
    
    # Analyze successful coping strategies mentioned in bot responses
    for msg in bot_messages:
        message_lower = msg['message'].lower()
        for coping in coping_words:
            if coping in message_lower and coping not in patterns['coping_strategies']:
                patterns['coping_strategies'].append(coping)
    
    # Limit to top patterns
    patterns['common_triggers'] = patterns['common_triggers'][:3]
    patterns['eating_mentions'] = patterns['eating_mentions'][:3]
    patterns['coping_strategies'] = patterns['coping_strategies'][:3]
    
    return patterns


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
        conversation_history = data.get("conversation_history", [])
        user_id = data.get("user_id", "")

        if not reason:
            return jsonify({"error": "Missing 'reason' field"}), 400

        # Analyze emotion using Hugging Face model
        emotion, confidence = analyze_emotion(reason)

        # Since this app is for emotional eating support, default to emotional eating unless clearly practical
        emotional_eating_keywords = [
            'feel', 'feeling', 'emotions', 'stress', 'sad', 'angry', 'upset', 'comfort', 'craving', 
            'want to eat because', 'emotional eating', 'patterns', 'track', 'habit', 'triggers', 
            'mood', 'celebrate', 'bored', 'anxious', 'worried', 'frustrated', 'lonely', 'tired',
            'pattern recognition', 'eating habits', 'food diary', 'daily meals', 'what i eat',
            'help me', 'support', 'guidance', 'understand myself', 'improve', 'recognize'
        ]
        
        # Only treat as practical nutrition if clearly asking about specific nutrition facts
        practical_keywords = [
            'calories in', 'nutrition facts', 'vitamins', 'protein content', 'carbs in',
            'how many calories', 'nutritional value', 'is [food] healthy', 'ingredients',
            'recipe', 'cooking', 'preparation'
        ]
        
        is_practical_nutrition = any(word in reason.lower() for word in practical_keywords)
        
        # Generate OpenAI response: Use history-aware version for better personalization
        if is_practical_nutrition:
            openai_response = generate_practical_response(reason)
        else:
            # Use context-aware response with conversation history
            openai_response = generate_openai_response_with_history(
                reason, emotion, confidence*100, conversation_history, user_id
            )
        
        # Use OpenAI response if successful, otherwise use enhanced fallback
        if openai_response:
            insight = openai_response
        else:
            # Enhanced emotional eating support responses
            emotion_responses = {
                'joy': "That's wonderful! Let's celebrate this positive moment in ways that nourish your body and soul. Consider a walk in nature, calling a friend, or treating yourself to a relaxing activity rather than food.",
                'sadness': "I hear that you're feeling sad. It's natural to seek comfort, but let's explore some gentle alternatives. Try some deep breathing, listen to soothing music, or reach out to someone you trust.",
                'anger': "Feeling angry can be overwhelming. Instead of turning to food, try some physical movement like stretching, journaling your thoughts, or taking a few minutes to cool down with some fresh air.",
                'fear': "When we're anxious or worried, food can feel like a quick comfort. Let's try some grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear. This can help calm your mind.",
                'surprise': "Unexpected emotions can catch us off guard! Take a moment to acknowledge what you're feeling. Sometimes a few deep breaths or a short mindful pause can help you respond rather than react.",
                'neutral': "It sounds like you're in a calm space right now. This is a great time to check in with yourself - are you eating because you're truly hungry, or for another reason? Trust your body's signals."
            }
            
            insight = emotion_responses.get(emotion.lower(), 
                f"I notice you're experiencing {emotion.lower()} feelings. Emotional eating is very common - you're not alone in this. Let's focus on understanding what you truly need right now. Is it comfort, energy, celebration, or something else?")

        # Log to CSV with user context
        df = pd.read_csv(LOG_FILE)
        df.loc[len(df)] = [datetime.now().isoformat(),
                           reason, emotion, confidence*100, user_id]
        df.to_csv(LOG_FILE, index=False)

        # Return JSON response with AI-generated insight
        return jsonify({
            "emotion": emotion,
            "confidence": confidence*100,
            "insight": insight
        })

    except Exception as e:
        logging.error(f"Error in classify: {str(e)}")
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
@limiter.limit("10 per minute")
def collect_feedback():
    """Collect user feedback for reinforcement learning"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        message = data.get('message')
        response = data.get('response')
        emotion = data.get('emotion')
        rating = data.get('rating')  # 1-5 scale
        feedback_text = data.get('feedback_text', '')
        
        if not all([user_id, message, response, emotion, rating]):
            return jsonify({"error": "Missing required fields"}), 400
        
        if not (1 <= rating <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        
        # Record feedback for learning
        rl_system.record_feedback(user_id, message, response, emotion, rating, feedback_text)
        
        # Save learning data
        rl_system.save_learning_data()
        
        return jsonify({
            "message": "Feedback recorded successfully",
            "user_id": user_id,
            "rating": rating,
            "learning_progress": len(rl_system.user_feedback[user_id])
        })
        
    except Exception as e:
        print(f"Error collecting feedback: {e}")
        return jsonify({"error": "Failed to collect feedback"}), 500

@app.route("/learning-stats/<user_id>", methods=["GET"])
@limiter.limit("5 per minute")
def get_learning_stats(user_id):
    """Get user's learning statistics and progress"""
    try:
        if user_id not in rl_system.user_feedback:
            return jsonify({
                "user_id": user_id,
                "message": "No learning data found for this user",
                "stats": {}
            })
        
        feedback_entries = rl_system.user_feedback[user_id]
        learning_curve = rl_system.learning_curves[user_id]
        
        if not feedback_entries:
            return jsonify({
                "user_id": user_id,
                "message": "No feedback data available",
                "stats": {}
            })
        
        # Calculate statistics
        total_feedback = len(feedback_entries)
        avg_rating = np.mean([f['rating'] for f in feedback_entries])
        success_rate = len([f for f in feedback_entries if f['success']]) / total_feedback * 100
        
        # Recent performance (last 5 interactions)
        recent_ratings = learning_curve[-5:] if learning_curve else []
        recent_avg = np.mean(recent_ratings) if recent_ratings else 0
        
        # Learning progress
        if len(learning_curve) >= 2:
            improvement = recent_avg - np.mean(learning_curve[:-5]) if len(learning_curve) > 5 else 0
        else:
            improvement = 0
        
        # Successful strategies
        successful_strategies = []
        if user_id in rl_system.success_patterns:
            for emotion, strategies in rl_system.success_patterns[user_id].items():
                if strategies:
                    successful_strategies.append(f"{emotion}: {len(strategies)} strategies")
        
        return jsonify({
            "user_id": user_id,
            "stats": {
                "total_interactions": total_feedback,
                "average_rating": round(avg_rating, 2),
                "success_rate": round(success_rate, 1),
                "recent_performance": round(recent_avg, 2),
                "improvement": round(improvement, 2),
                "successful_strategies": successful_strategies,
                "learning_curve": learning_curve[-10:]  # Last 10 ratings
            }
        })
        
    except Exception as e:
        print(f"Error getting learning stats: {e}")
        return jsonify({"error": "Failed to get learning stats"}), 500


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


@app.route("/user-patterns/<user_id>", methods=["GET"])
@limiter.limit("5 per minute")
def get_user_patterns(user_id):
    """Analyze and return a user's emotional eating patterns over time"""
    try:
        # Read the logs and filter by user
        df = pd.read_csv(LOG_FILE)
        
        if 'user_id' not in df.columns:
            return jsonify({"error": "User tracking not available in logs"}), 400
            
        user_data = df[df['user_id'] == user_id]
        
        if user_data.empty:
            return jsonify({
                "user_id": user_id,
                "patterns": "No conversation history found for this user yet. Keep chatting to build your pattern analysis!",
                "insights": [],
                "recommendations": ["Start logging your emotional triggers", "Notice when you feel like eating", "Practice mindful eating"]
            })
        
        # Analyze patterns
        total_interactions = len(user_data)
        emotion_counts = user_data['emotion'].value_counts().to_dict()
        most_common_emotion = user_data['emotion'].mode().iloc[0] if not user_data.empty else "neutral"
        avg_confidence = user_data['confidence'].mean()
        
        # Analyze time patterns
        user_data['timestamp'] = pd.to_datetime(user_data['timestamp'])
        user_data['hour'] = user_data['timestamp'].dt.hour
        common_hours = user_data['hour'].value_counts().head(3).index.tolist()
        
        # Generate insights
        insights = []
        recommendations = []
        
        if most_common_emotion in ['sadness', 'fear', 'anger']:
            insights.append(f"You often experience {most_common_emotion} when reaching out for support (detected in {emotion_counts.get(most_common_emotion, 0)} interactions)")
            recommendations.append(f"Consider having go-to strategies ready for when you feel {most_common_emotion}")
        
        if len(common_hours) > 0:
            insights.append(f"You tend to seek emotional eating support most during {common_hours[0]}:00 hour")
            recommendations.append(f"Plan healthy activities during your common trigger time around {common_hours[0]}:00")
        
        if avg_confidence > 80:
            insights.append("Your emotions are usually quite clear and intense - this self-awareness is a strength!")
            recommendations.append("Use your emotional awareness to pause and check: Am I truly hungry or seeking comfort?")
        
        if total_interactions >= 10:
            recent_emotions = user_data.tail(5)['emotion'].value_counts()
            if 'joy' in recent_emotions.index:
                insights.append("Great progress! You've been experiencing more positive emotions lately.")
                recommendations.append("Notice what's contributing to these positive feelings and build on them!")
        
        # Default recommendations if no specific patterns found
        if not recommendations:
            recommendations = [
                "Keep tracking your emotional triggers",
                "Practice the 5-minute pause before eating when emotional", 
                "Build a toolkit of non-food comfort activities"
            ]
        
        return jsonify({
            "user_id": user_id,
            "total_interactions": total_interactions,
            "patterns": {
                "most_common_emotion": most_common_emotion,
                "emotion_distribution": emotion_counts,
                "average_confidence": round(avg_confidence, 1),
                "common_interaction_hours": common_hours
            },
            "insights": insights,
            "recommendations": recommendations
        })
        
    except Exception as e:
        logging.error(f"Error in get_user_patterns: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error="Too many requests, please slow down."), 429


# Reinforcement Learning Components
class ReinforcementLearning:
    def __init__(self):
        self.user_feedback = defaultdict(list)  # user_id -> list of feedback
        self.success_patterns = defaultdict(dict)  # user_id -> successful strategies
        self.learning_curves = defaultdict(list)  # user_id -> satisfaction scores over time
        self.adaptive_responses = defaultdict(dict)  # user_id -> personalized response templates
        
    def record_feedback(self, user_id, message, response, emotion, rating, feedback_text=""):
        """Record user feedback for learning"""
        feedback_entry = {
            'timestamp': datetime.now().isoformat(),
            'user_message': message,
            'bot_response': response,
            'emotion': emotion,
            'rating': rating,  # 1-5 scale
            'feedback_text': feedback_text,
            'success': rating >= 4  # Consider 4-5 as successful
        }
        self.user_feedback[user_id].append(feedback_entry)
        
        # Update learning curve
        self.learning_curves[user_id].append(rating)
        
        # Analyze successful patterns
        if feedback_entry['success']:
            self._update_success_patterns(user_id, message, response, emotion)
    
    def _update_success_patterns(self, user_id, message, response, emotion):
        """Update successful response patterns for the user"""
        if user_id not in self.success_patterns:
            self.success_patterns[user_id] = defaultdict(list)
        
        # Extract key phrases from successful responses
        key_phrases = self._extract_key_phrases(response)
        self.success_patterns[user_id][emotion].extend(key_phrases)
        
        # Keep only top 5 successful patterns per emotion
        self.success_patterns[user_id][emotion] = list(set(
            self.success_patterns[user_id][emotion][-5:]
        ))
    
    def _extract_key_phrases(self, response):
        """Extract key phrases from successful responses"""
        phrases = []
        response_lower = response.lower()
        
        # Common successful phrases
        success_indicators = [
            'try', 'consider', 'suggest', 'instead', 'alternative',
            'breathing', 'walk', 'music', 'journal', 'meditation',
            'remember', 'noticed', 'pattern', 'helpful'
        ]
        
        for indicator in success_indicators:
            if indicator in response_lower:
                # Extract the sentence containing the indicator
                sentences = response.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        phrases.append(sentence.strip())
                        break
        
        return phrases[:3]  # Return top 3 phrases
    
    def get_adaptive_response_context(self, user_id, emotion):
        """Get personalized response context based on learning"""
        context = ""
        
        # Get user's learning curve
        if user_id in self.learning_curves:
            recent_scores = self.learning_curves[user_id][-5:]  # Last 5 interactions
            avg_satisfaction = np.mean(recent_scores) if recent_scores else 3.0
            context += f"\nUser satisfaction trend: {avg_satisfaction:.1f}/5 (recent average)"
        
        # Get successful patterns for this emotion
        if user_id in self.success_patterns and emotion in self.success_patterns[user_id]:
            successful_phrases = self.success_patterns[user_id][emotion]
            if successful_phrases:
                context += f"\nSuccessful strategies for {emotion}: {', '.join(successful_phrases[:2])}"
        
        # Get user's preferred response style
        if user_id in self.user_feedback:
            recent_feedback = self.user_feedback[user_id][-3:]  # Last 3 feedback entries
            high_rated = [f for f in recent_feedback if f['rating'] >= 4]
            if high_rated:
                context += f"\nUser responds well to: empathetic, actionable, and personalized responses"
        
        return context
    
    def save_learning_data(self):
        """Save learning data to files"""
        try:
            with open('user_feedback.pkl', 'wb') as f:
                pickle.dump(dict(self.user_feedback), f)
            with open('success_patterns.pkl', 'wb') as f:
                pickle.dump(dict(self.success_patterns), f)
            with open('learning_curves.pkl', 'wb') as f:
                pickle.dump(dict(self.learning_curves), f)
        except Exception as e:
            print(f"Error saving learning data: {e}")
    
    def load_learning_data(self):
        """Load learning data from files"""
        try:
            if os.path.exists('user_feedback.pkl'):
                with open('user_feedback.pkl', 'rb') as f:
                    self.user_feedback = defaultdict(list, pickle.load(f))
            if os.path.exists('success_patterns.pkl'):
                with open('success_patterns.pkl', 'rb') as f:
                    self.success_patterns = defaultdict(dict, pickle.load(f))
            if os.path.exists('learning_curves.pkl'):
                with open('learning_curves.pkl', 'rb') as f:
                    self.learning_curves = defaultdict(list, pickle.load(f))
        except Exception as e:
            print(f"Error loading learning data: {e}")

# Initialize RL system
rl_system = ReinforcementLearning()
rl_system.load_learning_data()

# Initialize Fun Facts Service
fun_facts_service = FunFactsService()


# Fun Facts Endpoints
@app.route("/fun-facts/random", methods=["GET"])
@limiter.limit("10 per minute")
def get_random_fact():
    """Get a random emotional eating fact"""
    try:
        fact = fun_facts_service.get_random_fact()
        if fact:
            return jsonify({
                "success": True,
                "fact": fact
            })
        else:
            return jsonify({
                "success": False,
                "error": "No facts available"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/daily", methods=["GET"])
@limiter.limit("10 per minute")
def get_fact_of_the_day():
    """Get today's emotional eating fact"""
    try:
        fact = fun_facts_service.get_fact_of_the_day()
        if fact:
            return jsonify({
                "success": True,
                "fact": fact
            })
        else:
            return jsonify({
                "success": False,
                "error": "No facts available"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/emotion/<emotion>", methods=["GET"])
@limiter.limit("10 per minute")
def get_facts_for_emotion(emotion):
    """Get facts relevant to a specific emotion"""
    try:
        facts = fun_facts_service.get_facts_for_emotion(emotion)
        if facts:
            return jsonify({
                "success": True,
                "emotion": emotion,
                "facts": facts if isinstance(facts, list) else [facts]
            })
        else:
            return jsonify({
                "success": False,
                "error": f"No facts available for emotion: {emotion}"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/categories", methods=["GET"])
@limiter.limit("10 per minute")
def get_fact_categories():
    """Get all available fact categories"""
    try:
        categories = fun_facts_service.get_categories()
        return jsonify({
            "success": True,
            "categories": categories
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/category/<category>", methods=["GET"])
@limiter.limit("10 per minute")
def get_facts_by_category(category):
    """Get all facts from a specific category"""
    try:
        facts = fun_facts_service.get_facts_by_category(category)
        return jsonify({
            "success": True,
            "category": category,
            "facts": facts
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/search", methods=["GET"])
@limiter.limit("10 per minute")
def search_facts():
    """Search facts by keyword"""
    try:
        query = request.args.get("q", "")
        if not query:
            return jsonify({
                "success": False,
                "error": "Query parameter 'q' is required"
            }), 400
        
        results = fun_facts_service.search_facts(query)
        return jsonify({
            "success": True,
            "query": query,
            "results": results
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/fun-facts/stats", methods=["GET"])
@limiter.limit("5 per minute")
def get_fact_stats():
    """Get statistics about the facts dataset"""
    try:
        stats = fun_facts_service.get_fact_stats()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
