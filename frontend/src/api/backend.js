// frontend/src/api/backend.js
import Constants from 'expo-constants';

// Retrieve backend URL from app.json extras
const backendUrl =
  Constants.expoConfig?.extra?.backendUrl ||
  Constants.manifest?.extra?.backendUrl;

async function request(path, { method = 'GET', body, token } = {}) {
  const url = `${backendUrl}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
}

// Auth
export const signup = (data) => request('/auth/signup', { method: 'POST', body: data });
export const login = (data) => request('/auth/login', { method: 'POST', body: data });

// Chat
export const sendMessage = (message, token) =>
  request('/api/chat/message', { method: 'POST', body: { message }, token });
export const getChatHistory = (token) => request('/api/chat/history', { token });

// Coping Tools
export const logToolUsage = (toolName, token) =>
  request('/api/tools/usage', { method: 'POST', body: { toolName }, token });
export const getUsageHistory = (token) => request('/api/tools/usage', { token });

// Insights
export const addInsight = (message, token) =>
  request('/api/insights', { method: 'POST', body: { message }, token });
export const getLatestInsight = (token) => request('/api/insights/latest', { token });
export const getAllInsights = (token) => request('/api/insights', { token });
