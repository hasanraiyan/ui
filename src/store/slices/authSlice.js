import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import { storage } from '../../utils/storage';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      await storage.set('authToken', response.data.token);
      await storage.set('userData', response.data.user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await authService.register(email, password, name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  }
);

const initialState = {
  isLoading: true,
  userToken: null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoading = false;
      state.userToken = null;
      state.user = null;
      state.error = null;
      storage.remove('authToken');
      storage.remove('userData');
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.userToken = action.payload.userToken;
      state.isLoading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userToken = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.userToken = null;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
