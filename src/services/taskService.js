import axios from './axiosInstance';

export const getTasks = () => axios.get('/planner');
export const addTask = (task) => axios.post('/planner', task);
export const updateTask = (taskId, updates) => axios.patch(`/planner/${taskId}`, updates);
export const deleteTask = (taskId) => axios.delete(`/planner/${taskId}`);
