import axios from 'axios';
import Constants from 'expo-constants';
import { storage } from '../utils/storage';

// Retrieve the base URL from app.json extra config
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined in app.json extra configuration! Define it in app.json -> extra");
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor: Inject Auth Token
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.get('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error retrieving token from storage", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional): Handle global errors like 401
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await storage.remove('authToken');
        await storage.remove('userData');
        // Handle unauthorized access (e.g., token expired)
        console.log('Unauthorized, logging out...');
      } catch (e) {
        console.error("Error removing token on 401", e);
      }
    }
    const message = error.response?.data?.message || error.message;
    console.error("API Error:", message);
    return Promise.reject(error.response?.data || { message });
  }
);

export default instance;
