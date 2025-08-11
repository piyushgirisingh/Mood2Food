# Mood2Food 🍽️💚

An intelligent emotional eating support application that helps users identify their eating patterns, recognize emotional triggers, and develop healthier coping strategies through AI-powered guidance and personalized insights.

## 🌟 Features

- **AI-Powered Chat Support**: Specialized chatbot for emotional eating guidance using GPT-4
- **Smart Pattern Recognition**: ML-powered analysis of emotional vs. physical hunger patterns
- **Comprehensive Food Logging**: Track mood, food intake, and eating motivations
- **Personalized Insights**: Data-driven insights and coping strategies
- **Crisis Intervention**: Support tools for emotional eating episodes
- **Progress Tracking**: Visual progress indicators and learning statistics
- **Mindful Eating Timer**: Guided mindfulness exercises
- **Secure Authentication**: JWT-based user authentication and session management

## 🛠️ Tech Stack

### Frontend
- **React 18** with Material-UI (MUI) components
- **React Router** for navigation
- **Axios** for API communication
- **JWT Decode** for token management
- **Responsive Design** with modern UI/UX

### Backend
- **Spring Boot 3.5.3** with Java 21
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **Flyway** for database migrations
- **PostgreSQL** as primary database
- **Lombok** for boilerplate reduction

### Machine Learning Service
- **Python Flask** API
- **Hugging Face Transformers** for NLP
- **Scikit-learn** for pattern recognition
- **TextBlob & NLTK** for text processing
- **OpenAI GPT-4** integration via Azure OpenAI

### Infrastructure
- **Docker & Docker Compose** for containerization
- **Nginx** reverse proxy
- **MySQL** for development database
- **Railway** deployment ready

## 🚀 Quick Start

### Prerequisites
- **Java 21+**
- **Node.js 16+**
- **Python 3.8+**
- **Docker & Docker Compose** (recommended)
- **PostgreSQL** or **MySQL** database

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Mood2Food
   ```

2. **Set environment variables**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   export OPENAI_API_BASE="your-openai-endpoint"
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - ML Service: http://localhost:10000

### Option 2: Local Development

#### 1. Backend Setup
```bash
cd backend

# Copy environment configuration
cp env.example .env
# Edit .env with your database and API credentials

# Run with Maven
./mvnw spring-boot:run
```

#### 2. Machine Learning Service
```bash
cd MachineLearning

# Copy environment configuration
cp env.example .env
# Edit .env with your OpenAI API credentials

# Install dependencies
pip install -r requirements.txt

# Run the service
python app.py
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/mood2food
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRATION=86400000

# ML Service Configuration
ML_BACKEND_URL=http://localhost:10000/classify-emotion

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_API_URL=your-openai-endpoint
```

### ML Service (.env)
```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_API_BASE=your-openai-endpoint
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ML_URL=http://localhost:10000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Token validation

### Chat & AI
- `POST /api/chat/message` - Send chat message
- `POST /api/chat/history` - Get chat history

### Food Logging
- `POST /api/food-log` - Create food log entry
- `GET /api/food-log` - Get user's food logs
- `PUT /api/food-log/{id}` - Update food log
- `DELETE /api/food-log/{id}` - Delete food log

### Insights & Analytics
- `GET /api/insights` - Get personalized insights
- `GET /api/dashboard` - Dashboard data
- `GET /api/reports` - Generate reports

### Coping Tools
- `POST /api/coping-tools/usage` - Log coping tool usage
- `GET /api/coping-tools` - Get available tools

### ML Service
- `POST /classify-emotion` - Emotion classification
- `POST /analyze-pattern` - Pattern analysis

## 🗄️ Database Schema

The application uses Flyway migrations for database management:

- **Users**: Authentication and profile data
- **Food Logs**: Mood, food, and eating motivation records
- **Chat Messages**: AI conversation history
- **Insights**: Generated insights and patterns
- **Coping Tools**: Usage tracking and effectiveness

## 🚀 Deployment

### Railway Deployment (Recommended)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

### API Testing
Import the Postman collection: `docs/postman/Mood2Food API.postman_collection.json`

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
./mvnw test
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Cross-origin request security
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Data sanitization and validation

## 📊 Monitoring & Analytics

- **Application Metrics**: Spring Boot Actuator
- **Error Tracking**: Comprehensive exception handling
- **Performance Monitoring**: Response time tracking
- **User Analytics**: Usage pattern analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](./docs) folder
- **Issues**: Report bugs via GitHub Issues
- **Deployment Help**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration
- Hugging Face for transformer models
- Material-UI for the beautiful component library
- Spring Boot community for the robust framework

---

**Made with ❤️ for better mental health and mindful eating**
