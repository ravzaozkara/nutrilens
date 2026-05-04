import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Extracts a user-readable message from an axios error.
 * - No response (network down / timeout) → English "cannot reach server" string
 * - HTTP error → backend's `detail` field if present (still in Turkish — data layer), else fallback
 */
export function getErrorMessage(err, fallback = 'An error occurred') {
  if (!err.response) return 'Cannot reach the server. Please check your internet connection.';
  return err.response?.data?.detail || err.response?.data?.message || fallback;
}

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (expired/invalid session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // /auth/password returns 401 for wrong current_password, not an expired session —
    // don't log the user out in that case.
    const isPasswordChange = error.config?.url?.includes('/auth/password');
    if (error.response?.status === 401 && !isPasswordChange) {
      // Store flag so Login page can surface "session expired" toast after navigation
      sessionStorage.setItem('session_expired', '1');
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
