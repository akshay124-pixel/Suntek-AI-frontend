import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.patch(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Time Logs API
export const timeLogsAPI = {
  startTimer: (taskId) => api.post(`/time-logs/tasks/${taskId}/start`),
  stopTimer: (timeLogId) => api.post(`/time-logs/${timeLogId}/stop`),
  getActiveTimer: () => api.get('/time-logs/active'),
  getTimeLogs: (params) => api.get('/time-logs', { params }),
  getTaskTimeLogs: (taskId) => api.get(`/time-logs/tasks/${taskId}`),
};

// Dashboard API
export const dashboardAPI = {
  getTodaySummary: () => api.get('/dashboard/today'),
  getWeeklySummary: () => api.get('/dashboard/weekly'),
  getOverallStats: () => api.get('/dashboard/stats'),
};

export default api;
