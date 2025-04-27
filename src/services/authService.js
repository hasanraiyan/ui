import axios from './axiosInstance';

// POST /api/auth/login
export const login = (email, password) =>
  axios.post('/auth/login', { email, password });

// POST /api/auth/register
export const register = (email, password, name) =>
  axios.post('/auth/register', { email, password, name });

// POST /api/password-reset/request
export const forgotPassword = (email) =>
  axios.post('/password-reset/request', { email });

// POST /api/password-reset/reset/:token
export const resetPassword = (token, password) =>
  axios.post(`/password-reset/reset/${token}`, { password });
