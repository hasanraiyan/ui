// FILE: src/services/chatService.js
import axios from './axiosInstance'; // Your configured axios instance

/**
 * Sends a message (text or image) to a chat session.
 * Handles creation of session on backend if sessionId is new.
 * @param {string} sessionId - The ID of the chat session (can be new).
 * @param {string} message - The text message content.
 * @param {'text' | 'image'} [type='text'] - The type of message.
 * @param {string} [imageUrl] - The public URL of the image (if type is 'image').
 *                              NOTE: Assumes image is already uploaded and URL is provided.
 * @returns {Promise<AxiosResponse<any>>} - API response with recent messages, tool results etc.
 */
export const sendMessage = (sessionId, message, type = 'text', imageUrl = undefined) => {
  if (!sessionId) return Promise.reject(new Error('Session ID is required for sendMessage.'));

  const payload = {
    sessionId,
    message: message || '', // Ensure message is at least empty string
    type,
    // Only include imageUrl in payload if type is 'image' and URL exists
    ...(type === 'image' && imageUrl && { imageUrl }),
  };
  console.log('Sending message payload:', payload); // Log payload for debugging
  return axios.post('/chat', payload); // POST /api/chat
};

// --- Placeholder for Image Upload ---
/**
 * Uploads an image file to the server (IMPLEMENTATION NEEDED).
 * Requires a backend endpoint (e.g., POST /api/upload/image) that accepts multipart/form-data.
 * @param {string} localUri - The local file URI from ImagePicker.
 * @returns {Promise<{url: string}>} - A promise resolving with the public URL of the uploaded image.
 */
export const uploadImage = async (localUri) => {
    console.warn("uploadImage service function is a placeholder and needs implementation pointing to a backend endpoint.");
    // --- Example using FormData (requires backend setup) ---
    /*
    const formData = new FormData();
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('imageFile', { uri: localUri, name: filename, type }); // Use 'imageFile' or whatever backend expects

    try {
      // Replace with your actual backend upload endpoint
      const response = await axios.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.url) {
        return { url: response.data.url };
      } else {
        throw new Error('Image URL not found in upload response.');
      }
    } catch (error) {
      console.error("Image upload failed in service:", error.response?.data || error.message);
      throw error; // Re-throw
    }
    */
    // --- End Example ---

    // Return a placeholder or reject
    // return Promise.resolve({ url: 'https://via.placeholder.com/300/09f/fff.png' }); // For testing UI
    return Promise.reject(new Error("Image upload not implemented."));
};
// --- End Placeholder ---


/**
 * Retrieves messages for a specific chat session, paginated.
 * @param {string} sessionId - The ID of the chat session.
 * @param {number} [page=1] - The page number.
 * @param {number} [limit=30] - Messages per page.
 * @returns {Promise<AxiosResponse<any>>} - API response { messages, total, page, limit }.
 */
export const getMessages = (sessionId, page = 1, limit = 30) => {
  if (!sessionId) return Promise.reject(new Error('Session ID required for getMessages.'));
  return axios.get(`/chat/sessions/${sessionId}/messages`, {
    params: { page, limit },
  });
};

/**
 * Retrieves a list of chat session summaries for the logged-in user.
 * @returns {Promise<AxiosResponse<Array<{sessionId, title, createdAt, lastActivity, messageCount}>>>}
 */
export const getSessions = () => {
  return axios.get('/chat/sessions');
};

/**
 * Searches chat sessions by title.
 * @param {string} query - The search term.
 * @returns {Promise<AxiosResponse<Array<{sessionId, title, createdAt, lastActivity, messageCount}>>>}
 */
export const searchSessions = (query) => {
  if (!query) return Promise.reject(new Error('Search query is required.'));
  return axios.get('/chat/sessions/search', { params: { q: query } });
};

/**
 * Renames a chat session.
 * @param {string} sessionId - The ID of the session to rename.
 * @param {string} newTitle - The new title.
 * @returns {Promise<AxiosResponse<{sessionId, title}>>}
 */
export const renameSession = (sessionId, newTitle) => {
  if (!sessionId || !newTitle?.trim()) return Promise.reject(new Error('Session ID and new title are required.'));
  return axios.patch(`/chat/sessions/${sessionId}/title`, { title: newTitle.trim() });
};

/**
 * Deletes a chat session.
 * @param {string} sessionId - The ID of the session to delete.
 * @returns {Promise<AxiosResponse<{message, sessionId}>>}
 */
export const deleteSession = (sessionId) => {
  if (!sessionId) return Promise.reject(new Error('Session ID required for deleteSession.'));
  return axios.delete(`/chat/sessions/${sessionId}`);
};

/**
 * Exports a chat session as JSON data.
 * @param {string} sessionId - The ID of the session to export.
 * @returns {Promise<AxiosResponse<object>>} - Response containing the chat data.
 */
export const exportSession = (sessionId) => {
    if (!sessionId) return Promise.reject(new Error('Session ID required for exportSession.'));
    // Backend sends JSON, frontend receives it directly
    return axios.get(`/chat/sessions/${sessionId}/export`);
};

/**
 * Submits feedback for a specific AI message using its index.
 * NOTE: Using index is less robust than using message ID. Consider backend update.
 * @param {string} sessionId - The ID of the chat session.
 * @param {number} messageIndex - The 0-based index of the AI message in the current list.
 * @param {number} rating - The feedback rating (1-5).
 * @returns {Promise<AxiosResponse<{message}>>}
 */
export const postMessageFeedback = (sessionId, messageIndex, rating) => {
  if (!sessionId || messageIndex === undefined || messageIndex < 0 || !rating) {
    return Promise.reject(new Error('Session ID, valid message index, and rating are required.'));
  }
  if (rating < 1 || rating > 5) {
      return Promise.reject(new Error('Rating must be between 1 and 5.'));
  }
  console.warn("Sending feedback using messageIndex. This can be unreliable.");
  return axios.post(`/chat/${sessionId}/feedback`, { messageIndex: messageIndex, feedback: rating });
};

/**
 * Manually saves a task to the planner, potentially derived from chat context.
 * @param {string} sessionId - The ID of the chat session (for context).
 * @param {{title: string, description?: string, dueDate?: string | Date}} taskData - Task details.
 * @returns {Promise<AxiosResponse<object>>} - Response containing the created task object.
 */
export const saveTaskFromChat = (sessionId, taskData) => {
    if (!sessionId || !taskData || !taskData.title) {
      return Promise.reject(new Error('Session ID and Task Title are required.'));
    }
    // Ensure dueDate is in ISO format if it's a Date object
    const payload = { ...taskData };
    if (payload.dueDate instanceof Date) {
        payload.dueDate = payload.dueDate.toISOString();
    }
  return axios.post(`/chat/${sessionId}/save-task`, payload); // POST /api/chat/:sessionId/save-task
};