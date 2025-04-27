import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import taskReducer from './slices/taskSlice';
import moodReducer from './slices/moodSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    task: taskReducer,
    mood: moodReducer,
    ui: uiReducer,
  },
});

export default store;
