import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const { addTask, removeTask, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
