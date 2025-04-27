import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mood: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setMood: (state, action) => {
      state.mood = action.payload;
    },
    clearMood: (state) => {
      state.mood = null;
    },
  },
});

export const { setMood, clearMood } = moodSlice.actions;
export default moodSlice.reducer;
