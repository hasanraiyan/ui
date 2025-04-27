import axios from './axiosInstance';

export const login = (email, password) =>
  axios.post('/auth/login', { email, password });

export const register = (email, password, name) =>
  axios.post('/auth/register', { email, password, name });

export const forgotPassword = (email) =>
  axios.post('/password-reset', { email });

export const resetPassword = (token, password) =>
  axios.post('/password-reset/confirm', { token, password });
