// FILE: src/store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatService from '../../services/chatService';

// --- Async Thunks ---

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ sessionId, message, type = 'text', imageUrl = undefined, tempId }, { rejectWithValue }) => {
    try {
      // Assumes image upload happens before this thunk is called
      const response = await chatService.sendMessage(sessionId, message, type, imageUrl);
      // Return data needed to update state: session ID and the *new* messages from the response
      // Also include tempId to identify the optimistic message to replace/remove
      return { sessionId, messages: response.data.messages, toolResults: response.data.toolResults, tempId };
    } catch (error) {
       const errorMsg = error.response?.data?.message || error.message || `Failed to send ${type} message.`;
       console.error("sendMessage Thunk Error:", errorMsg, error.response?.data);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ sessionId, page = 1, limit = 30 }, { rejectWithValue, getState }) => {
    try {
       // Prevent fetching if already loading this page for this session
      const currentSessionState = getState().chat.messagesBySession[sessionId];
      if (currentSessionState?.isLoading && currentSessionState?.pageBeingFetched === page) {
          console.log(`fetchMessages skipped for ${sessionId} page ${page} - already loading.`);
          return rejectWithValue('Fetch already in progress for this page.'); // Or just return without error
      }

      const response = await chatService.getMessages(sessionId, page, limit);
      const messages = response.data.messages || [];
      const total = response.data.total || 0;
      const currentPageNum = response.data.page || page;
      const limitNum = response.data.limit || limit;
      const hasMore = messages.length === limitNum && (currentPageNum * limitNum < total);

      return { sessionId, messages, total, page: currentPageNum, limit: limitNum, hasMore };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch messages.';
      console.error("fetchMessages Thunk Error:", errorMsg, error.response?.data);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSessions = createAsyncThunk(
  'chat/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getSessions();
      return response.data || []; // Ensure it returns an array
    } catch (error) {
       const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch sessions.';
       console.error("fetchSessions Thunk Error:", errorMsg, error.response?.data);
      return rejectWithValue(errorMsg);
    }
  }
);

// --- Initial State Structure ---
const initialSessionState = {
    messages: [],
    total: 0,
    page: 0, // Start at page 0, first fetch will be page 1
    limit: 30,
    hasMore: true,
    isLoading: false,
    pageBeingFetched: null, // Track which page is currently loading
    error: null,
};

const initialState = {
  sessions: null, // Use null initially to distinguish from empty array after fetch
  messagesBySession: {}, // Cache messages: { sessionId: SessionState }
  currentSessionId: null,
  isSessionListLoading: false,
  sessionListError: null,
};

// --- Slice Definition ---
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload;
      // Initialize session state if it doesn't exist when set
      if (action.payload && !state.messagesBySession[action.payload]) {
          state.messagesBySession[action.payload] = { ...initialSessionState };
      }
    },
    addOptimisticMessage: (state, action) => {
        const { sessionId, message } = action.payload;
        if (!state.messagesBySession[sessionId]) {
            state.messagesBySession[sessionId] = { ...initialSessionState, messages: [] };
        }
        // Add to the beginning for inverted list
        state.messagesBySession[sessionId].messages.unshift(message);
    },
    // TODO: Add reducer to update optimistic message state (e.g., on error)
    // updateOptimisticMessageState: (state, action) => {
    //    const { sessionId, messageId, updates } = action.payload;
    //    const session = state.messagesBySession[sessionId];
    //    if (session) {
    //        const msgIndex = session.messages.findIndex(m => m._id === messageId);
    //        if (msgIndex !== -1) {
    //            session.messages[msgIndex] = { ...session.messages[msgIndex], ...updates };
    //        }
    //    }
    // },
    clearChatState: (state) => { // e.g., on logout
        return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Send Message Reducers ---
      .addCase(sendMessage.pending, (state, action) => {
        const { sessionId, tempId } = action.meta.arg;
        const session = state.messagesBySession[sessionId];
        if (session) {
            // Mark the specific optimistic message as loading (optional visual cue)
            const msgIndex = session.messages.findIndex(m => m._id === tempId);
            if (msgIndex !== -1) session.messages[msgIndex].isLoading = true;
            session.error = null; // Clear previous session error on new send attempt
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { sessionId, messages: receivedMessages, tempId } = action.payload;
        const session = state.messagesBySession[sessionId];
        if (session) {
            // Remove the optimistic message identified by tempId
            session.messages = session.messages.filter(m => m._id !== tempId);

            // Add the messages received from the server (likely user msg + AI response)
            // Ensure no duplicates if server response includes messages already present
            const existingIds = new Set(session.messages.map(m => m._id));
            const newMessagesToAdd = receivedMessages.filter(m => !existingIds.has(m._id));
            session.messages.unshift(...newMessagesToAdd); // Add to beginning (inverted list)

            session.isLoading = false; // Ensure loading state is off
            session.error = null; // Clear any previous errors
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const { sessionId, tempId } = action.meta.arg;
        const session = state.messagesBySession[sessionId];
        if (session) {
            session.isLoading = false; // Stop loading indicator
            session.error = action.payload; // Store session-level error message
             // Mark the specific optimistic message as failed
             const msgIndex = session.messages.findIndex(m => m._id === tempId);
             if (msgIndex !== -1) {
                 session.messages[msgIndex].isLoading = false;
                 session.messages[msgIndex].error = action.payload;
             }
        }
      })
      // --- Fetch Messages Reducers ---
      .addCase(fetchMessages.pending, (state, action) => {
        const { sessionId, page } = action.meta.arg;
        if (!state.messagesBySession[sessionId]) { // Initialize if missing
            state.messagesBySession[sessionId] = { ...initialSessionState };
        }
        state.messagesBySession[sessionId].isLoading = true;
        state.messagesBySession[sessionId].pageBeingFetched = page; // Track page being fetched
        state.messagesBySession[sessionId].error = null; // Clear error on new fetch
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { sessionId, messages, total, page, limit, hasMore } = action.payload;
        const session = state.messagesBySession[sessionId];
        if (session) {
            session.isLoading = false;
            session.pageBeingFetched = null;
            session.total = total;
            session.page = page;
            session.limit = limit;
            session.hasMore = hasMore;
            session.error = null;

            // Append messages carefully, avoiding duplicates
            const existingIds = new Set(session.messages.map(m => m._id));
            const uniqueNewMessages = messages.filter(m => !existingIds.has(m._id));

            if (page === 1) {
                // If fetching page 1, replace existing messages
                session.messages = messages;
            } else {
                // Append older messages to the end (visual top) for inverted list
                session.messages.push(...uniqueNewMessages);
            }
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const { sessionId } = action.meta.arg;
        const session = state.messagesBySession[sessionId];
        if (session) {
          session.isLoading = false;
          session.pageBeingFetched = null;
          // Don't overwrite existing messages on error, just store the error
          session.error = action.payload;
        }
      })
      // --- Fetch Sessions Reducers ---
      .addCase(fetchSessions.pending, (state) => {
        state.isSessionListLoading = true;
        state.sessionListError = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isSessionListLoading = false;
        state.sessions = action.payload; // Replace session list
        state.sessionListError = null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isSessionListLoading = false;
        state.sessionListError = action.payload;
        // state.sessions = null; // Optionally clear sessions on error? Or keep stale data?
      });
  },
});

// --- Exports ---
export const { setCurrentSessionId, addOptimisticMessage, clearChatState } = chatSlice.actions;

// Selectors
export const selectMessagesForSession = (state, sessionId) =>
  state.chat.messagesBySession[sessionId]?.messages || [];

export const selectChatSessionState = (state, sessionId) =>
    state.chat.messagesBySession[sessionId] || initialSessionState; // Return default state if session not found

export default chatSlice.reducer;