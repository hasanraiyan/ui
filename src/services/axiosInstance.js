import axios from 'axios';
import Constants from 'expo-constants';

const instance = axios.create({
  baseURL: Constants?.manifest?.extra?.API_BASE_URL || process.env.API_BASE_URL,
  timeout: 10000,
});

// Add interceptors for auth, error handling, etc. here

export default instance;
