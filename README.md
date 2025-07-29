# Mood2Food 🍽️💚

An emotional eating support application that helps users identify their eating patterns, recognize emotional triggers, and develop healthier coping strategies.

## Features ✨

- **Emotional Eating Support**: AI-powered chatbot specialized in emotional eating guidance
- **Pattern Recognition**: Track and analyze your emotional eating patterns
- **Smart Responses**: GPT-4 powered responses tailored to emotional vs practical food questions
- **User Authentication**: Secure JWT-based authentication
- **Real-time Chat**: Interactive chat interface for ongoing support

## Tech Stack 🛠️

- **Frontend**: React.js
- **Backend**: Java Spring Boot
- **ML Service**: Python Flask with Hugging Face Transformers
- **AI**: OpenAI GPT-4 (via AzureOpenAI)
- **Database**: MySQL (AWS RDS)
- **Authentication**: JWT tokens

## Setup Instructions 🚀

### Prerequisites
- Java 21+
- Node.js 16+
- Python 3.8+
- MySQL database

### 1. Backend Setup
```bash
cd backend
# Copy and configure environment variables
cp env.example .env
# Edit .env with your actual values

# Run the backend
./mvnw spring-boot:run
```

### 2. ML Service Setup  
```bash
cd MachineLearning
# Copy and configure environment variables
cp env.example .env
# Edit .env with your OpenAI API credentials

# Install dependencies
pip install -r requirements.txt

# Run the ML service
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start the frontend
npm start
```

### 4. Environment Configuration

Create `.env` files in both `backend/` and `MachineLearning/` directories using the provided `env.example` templates.

**Backend (.env):**
- Database credentials (AWS RDS)
- JWT secret
- ML service URL
- OpenAI API credentials

**ML Service (.env):**
- OpenAI API key and endpoint

## Usage 💬

1. Navigate to `http://localhost:3000`
2. Create an account or login
3. Start chatting with the AI assistant
4. Get personalized emotional eating support and pattern insights

## API Endpoints 📡

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/chat/message` - Send chat message
- `POST /classify-emotion` - ML emotion analysis (internal)

## Security 🔒

- Environment variables for sensitive data
- JWT token authentication
- Secure database connections
- API rate limiting

## 🚀 Project Overview

Mood2Food allows users to quickly log:
- Their current mood (e.g., happy, anxious)
- What they ate
- Why they ate (emotionally or physically hungry)

We use NLP + ML to detect patterns of emotional eating and provide actionable feedback.

## 🔧 Tech Stack

- **Frontend:** React (or Flutter)
- **Backend:** Flask / Node.js
- **AI/NLP:** Python (TextBlob, VADER, or HuggingFace)
- **Database:** Firebase / MongoDB
- **Visualization:** Chart.js / D3.js

## 🧠 Core Features

- Quick mood + food logging
- Emotion classifier for hunger reasoning
- Insights and visualizations
- Personalized coping tips

### 🧪 Postman Collection
Import the Postman collection to test all AI/ML endpoints.

- [Download Collection](./postman/Mood2Food.postman_collection.json)

To import:
1. Open Postman
2. Click "Import"
3. Choose this `.json` file
