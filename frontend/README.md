# Mood2Food Frontend

A modern React web application for mental health and wellness tracking, featuring AI-powered chat, coping tools, insights, and trigger logging.

## Features

- **User Authentication** - Secure login and signup with JWT tokens
- **Dashboard** - Overview of user activity and statistics
- **AI Chat** - Interactive chat with machine learning backend
- **Coping Tools** - Various mental health coping strategies
- **Personal Insights** - Record and track personal growth moments
- **Trigger Logs** - Track emotional triggers and patterns

## Tech Stack

- **React 18** - Frontend framework
- **Material-UI (MUI)** - Component library and design system
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running on localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env file is already created with:
REACT_APP_API_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Integration

The frontend connects to the backend API at `http://localhost:8080` with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/dashboard` - Dashboard data
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `POST /api/tools/usage` - Log coping tool usage
- `GET /api/tools/usage` - Get usage history
- `POST /api/insights` - Add new insight
- `GET /api/insights` - Get all insights
- `POST /api/logs/trigger` - Save trigger log
- `GET /api/logs` - Get trigger logs

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.js       # Main layout with navigation
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Signup.js       # Signup page
│   ├── Dashboard.js    # Dashboard page
│   ├── Chat.js         # Chat page
│   ├── CopingTools.js  # Coping tools page
│   ├── Insights.js     # Insights page
│   └── TriggerLogs.js  # Trigger logs page
├── services/           # API services
│   └── api.js          # API client and endpoints
├── App.js              # Main app component
└── index.js            # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Authentication

The app uses JWT tokens stored in localStorage. All protected routes require authentication and will redirect to login if not authenticated.

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
