import axios from './axiosInstance';

export const sendMessage = (message, sessionId) =>
  axios.post('/chat', { message, sessionId });

export const getSessions = () =>
  axios.get('/chat/sessions');

export const exportSession = (sessionId) =>
  axios.get(`/chat/sessions/${sessionId}/export`);
