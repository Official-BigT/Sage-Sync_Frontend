import axios from "axios";
import { refreshToken } from "./authService";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // from .env
  withCredentials: true, // send cookies if backend uses them
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
