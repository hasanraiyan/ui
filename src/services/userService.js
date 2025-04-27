import axios from './axiosInstance';

export const getProfile = () => axios.get('/user/profile');
export const updateProfile = (profile) => axios.put('/user/profile', profile);
export const changePassword = (currentPassword, newPassword) =>
  axios.post('/user/change-password', { currentPassword, newPassword });
