import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle response errors
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
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Tasks API
export const tasksAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getTasks: (status) => api.get(`/tasks${status ? `?status=${status}` : ''}`),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Comments API
export const commentsAPI = {
  addComment: (taskId, commentData) => api.post(`/api/tasks/${taskId}/comments`, commentData),
  getComments: (taskId) => api.get(`/api/tasks/${taskId}/comments`),
  updateComment: (commentId, commentData) => api.put(`/api/comments/${commentId}`, commentData),
  deleteComment: (commentId) => api.delete(`/api/comments/${commentId}`),
};

export default api;
