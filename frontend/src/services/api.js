import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
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
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/api/chat/message', { message }),
  getChatHistory: () => api.get('/api/chat/history'),
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

export default api; 