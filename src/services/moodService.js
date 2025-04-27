import axios from './axiosInstance';

export const logMood = (mood, context) =>
  axios.post('/mood', { mood, context });

export const getMoodHistory = () =>
  axios.get('/mood/history');
