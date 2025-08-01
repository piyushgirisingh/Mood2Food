import axios from 'axios';

// Environment variables for backend and ML URLs
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const mlUrl = import.meta.env.VITE_ML_URL || 'http://localhost:10000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get('/api/dashboard'),
  getFunFact: () => api.get('/api/dashboard/fun-fact'),
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/api/chat/message', { message }),
  getChatHistory: () => api.get('/api/chat/history'),
  sendFeedback: (feedbackData) => api.post('/api/chat/feedback', feedbackData),
  getLearningStats: () => api.get('/api/chat/learning-stats'),
};

// Trigger Logs API
export const triggerLogAPI = {
  saveTriggerLog: (logData) => api.post('/api/logs/trigger', logData),
  getTriggerLogs: () => api.get('/api/logs'),
};

// Coping Tools API
export const copingToolAPI = {
  logUsage: (toolName) => api.post('/api/tools/usage', { toolName }),
  getUsageHistory: () => api.get('/api/tools/usage'),
};

// Insights API
export const insightAPI = {
  addInsight: (message) => api.post('/api/insights', { message }),
  getAllInsights: () => api.get('/api/insights'),
  getLatestInsight: () => api.get('/api/insights/latest'),
};

// Food Log API
export const foodLogAPI = {
  createFoodLog: (foodLogData) => api.post('/api/food-logs', foodLogData),
  getFoodLogs: () => api.get('/api/food-logs'),
  getTodayFoodLogs: () => api.get('/api/food-logs/today'),
  getFoodLogsByDate: (date) => api.get(`/api/food-logs/date/${date}`),
  getFoodLogsByMealType: (mealType) => api.get(`/api/food-logs/meal-type/${mealType}`),
  getFoodLogsByEmotion: (emotion) => api.get(`/api/food-logs/emotion/${emotion}`),
  getRecentFoodLogs: () => api.get('/api/food-logs/recent'),
  getFoodLogStats: () => api.get('/api/food-logs/stats'),
  updateFoodLog: (foodLogId, foodLogData) => api.put(`/api/food-logs/${foodLogId}`, foodLogData),
  deleteFoodLog: (foodLogId) => api.delete(`/api/food-logs/${foodLogId}`),
};

// Food Insights API
export const foodInsightsAPI = {
  getEmotionalEatingPatterns: () => api.get('/api/food-insights/patterns'),
  getRecentFoodInsights: () => api.get('/api/food-insights/recent'),
};

// ML API - Direct calls to ML service
export const mlAPI = {
  classifyEmotion: async (reason) => {
    const res = await fetch(`${mlUrl}/classify-emotion`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },
  
  getUserPatterns: async (userId) => {
    const res = await fetch(`${mlUrl}/user-patterns/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },
  
  sendFeedback: async (feedbackData) => {
    const res = await fetch(`${mlUrl}/feedback`, {
      method: "POST",
      body: JSON.stringify(feedbackData),
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },
  
  getLearningStats: async (userId) => {
    const res = await fetch(`${mlUrl}/learning-stats/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },
  
  getRandomFact: async () => {
    const res = await fetch(`${mlUrl}/fun-facts/random`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  },
  
  getFactOfTheDay: async () => {
    const res = await fetch(`${mlUrl}/fun-facts/daily`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return res.json();
  }
};

export default api; 