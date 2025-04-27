import axios from 'axios';
import Constants from 'expo-constants';
import { storage } from '../utils/storage';

// Use expoConfig for SDK 48+
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined in app.json extra configuration!");
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor: Inject Auth Token
instance.interceptors.request.use(
  async (config) => {
    const token = await storage.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors like 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      storage.remove('authToken');
      // Optionally handle navigation to login
    }
    const message = error.response?.data?.message || error.message;
    console.error("API Error:", message);
    return Promise.reject({ message });
  }
);

export default instance;
