import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor for JWT Token
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const BACKEND_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

export default api;