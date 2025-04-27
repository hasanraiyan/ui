// FILE: src/screens/Chat/ChatScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  AppState,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// --- Components ---
import ChatInputBar from '../../components/Chat/ChatInputBar';
import MessageBubble from '../../components/Chat/MessageBubble';
import ErrorMessage from '../../components/common/ErrorMessage';

// --- Constants & Theme ---
import { theme, routes } from '../../constants';

// --- Redux ---
import {
  fetchMessages,
  sendMessage,
  selectMessagesForSession,
  selectChatSessionState,
  addOptimisticMessage,
  setCurrentSessionId,
  // updateOptimisticMessageState, // Action needed for updating error state on messages
} from '../../store/slices/chatSlice';

// --- Services ---
import * as chatService from '../../services/chatService';

// --- Component ---
export default function ChatScreen({ route, navigation }) {
  // --- Params & Session ID ---
  const sessionIdFromParams = route.params?.sessionId;
  const sessionTitleFromParams = route.params?.sessionTitle;
  const initialMessage = route.params?.initialMessage;

  // Determine if this screen instance is for an existing session
  const IS_EXISTING_SESSION = !!sessionIdFromParams;

  // Generate a stable session ID *only if needed* for a new session
  const generatedSessionId = useRef(IS_EXISTING_SESSION ? null : `session_${uuidv4()}`).current;
  const effectiveSessionId = sessionIdFromParams || generatedSessionId; // Use param if available, else generated

  // Determine title
  const sessionTitle = sessionTitleFromParams || (IS_EXISTING_SESSION ? 'Chat' : 'New Chat');

  // --- Redux ---
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  // Selectors must use the correct, stable effectiveSessionId
  const messagesForCurrentSession = useSelector((state) => selectMessagesForSession(state, effectiveSessionId));
  const {
    isLoading: isLoadingMessages,
    error: messagesError,
    hasMore: hasMoreMessages,
    page: currentPage,
  } = useSelector((state) => selectChatSessionState(state, effectiveSessionId));

  // --- Local State & Refs ---
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef(null);
  const isMountedRef = useRef(false);

  // --- Helpers ---
  const scrollToBottom = useCallback((animated = true) => {
    if (flatListRef.current && messagesForCurrentSession?.length > 0) {
      try {
        flatListRef.current.scrollToOffset({ offset: 0, animated });
      } catch (error) {
        console.warn("ChatScreen: ScrollToBottom error:", error);
      }
    }
    setIsAtBottom(true); // Assume user is at bottom after scroll command
  }, [messagesForCurrentSession]); // Dependency on messages length

  // --- Effects ---

  // Mount/Unmount Tracking
  useEffect(() => {
    isMountedRef.current = true;
    console.log(`ChatScreen MOUNTED - Session ID: ${effectiveSessionId}, Is Existing: ${IS_EXISTING_SESSION}`);
    // Set the navigator title when the component mounts or session title changes
    navigation.setOptions({ title: sessionTitle });
    return () => {
      isMountedRef.current = false;
      console.log(`ChatScreen UNMOUNTED - Session ID: ${effectiveSessionId}`);
    };
  }, [effectiveSessionId, IS_EXISTING_SESSION, navigation, sessionTitle]); // Add navigation/title deps


  // Session Setup & Initial Fetch/Message
  useEffect(() => {
    console.log(`ChatScreen Setup Effect START - Session ID: ${effectiveSessionId}, Is Existing: ${IS_EXISTING_SESSION}`);
    dispatch(setCurrentSessionId(effectiveSessionId));
    setSendError(null);

    // *** CORE FIX: Only fetch if IS_EXISTING_SESSION is true ***
    if (IS_EXISTING_SESSION) {
      console.log(`>>> EFFECT: Fetching messages for EXISTING session: ${effectiveSessionId}`);
      dispatch(fetchMessages({ sessionId: effectiveSessionId, page: 1 }));
    } else {
      console.log(`>>> EFFECT: NEW session (${effectiveSessionId}). SKIPPING history fetch.`);
      scrollToBottom(false); // Ensure view starts scrolled down for new chat
    }

    // Handle initial message
    if (initialMessage) {
      console.log(`>>> EFFECT: Handling initial message: "${initialMessage}"`);
      navigation.setParams({ initialMessage: null });
      const sendTimer = setTimeout(() => {
        if (isMountedRef.current) handleSend({ type: 'text', text: initialMessage });
      }, 200);
      return () => clearTimeout(sendTimer);
    }
    console.log(`ChatScreen Setup Effect END - Session ID: ${effectiveSessionId}`);
  }, [dispatch, effectiveSessionId, navigation, initialMessage, IS_EXISTING_SESSION]);


  // Auto-scroll Effect
  useEffect(() => {
    if (messagesForCurrentSession?.length > 0 && isAtBottom) {
      const scrollTimer = setTimeout(() => {
        if (isMountedRef.current) scrollToBottom(true);
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [messagesForCurrentSession?.length, isAtBottom, scrollToBottom]); // Add scrollToBottom


  // Optional: App State Change Listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isMountedRef.current && IS_EXISTING_SESSION && effectiveSessionId) {
        // Optional: refetch on foreground
        // console.log('App active, potentially refetching for existing session:', effectiveSessionId);
        // dispatch(fetchMessages({ sessionId: effectiveSessionId, page: 1 }));
      }
    });
    return () => subscription.remove();
  }, [dispatch, effectiveSessionId, IS_EXISTING_SESSION]);


  // --- Callbacks ---

  // Load More Messages
  const loadMoreMessages = useCallback(() => {
    if (!IS_EXISTING_SESSION || isLoadingMessages || !hasMoreMessages || !isMountedRef.current) {
        console.log(`loadMoreMessages SKIPPED: New=${!IS_EXISTING_SESSION}, Loading=${isLoadingMessages}, NoMore=${!hasMoreMessages}, Unmounted=${!isMountedRef.current}`);
        return;
    }
    console.log(`>>> loadMoreMessages: Loading page ${currentPage + 1} for session ${effectiveSessionId}`);
    dispatch(fetchMessages({ sessionId: effectiveSessionId, page: currentPage + 1 }));
  }, [dispatch, isLoadingMessages, hasMoreMessages, currentPage, effectiveSessionId, IS_EXISTING_SESSION]);

  // Handle Send Button Press
  const handleSend = useCallback(async (inputData) => {
    const textToSend = inputData.text?.trim() || '';
    if (isSending || (inputData.type === 'text' && !textToSend)) return;

    if (Platform.OS !== 'web') Keyboard.dismiss();
    setIsSending(true);
    setSendError(null);

    const optimisticMessage = { /* ... as before ... */
        _id: uuidv4(), sender: 'user', message: textToSend, type: inputData.type,
        imageUrl: inputData.type === 'image' ? inputData.uri : undefined,
        timestamp: new Date().toISOString(), isLoading: true, error: null,
    };

    console.log(`Adding optimistic message ${optimisticMessage._id} for session ${effectiveSessionId}`);
    dispatch(addOptimisticMessage({ sessionId: effectiveSessionId, message: optimisticMessage }));

    if (isAtBottom) setTimeout(() => scrollToBottom(true), 50);

    let finalImageUrl = null;
    // --- Image Upload Placeholder ---
    if (inputData.type === 'image' && inputData.uri) {
      try {
        console.warn("Placeholder: Simulating image upload...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        finalImageUrl = inputData.uri; // Placeholder
        console.log("Placeholder Upload Success.");
      } catch (uploadError) {
        console.error("Image Upload Failed:", uploadError);
        const errorMsg = `Upload failed: ${uploadError.message || 'Try again'}`;
        setSendError(errorMsg);
        // TODO: dispatch(updateOptimisticMessageState(...error...));
        if (isMountedRef.current) setIsSending(false);
        return;
      }
    }
    // --- End Image Upload ---

    try {
      if (!effectiveSessionId) throw new Error("Cannot send message: Session ID is missing.");
      console.log(`Dispatching sendMessage thunk: S_ID=${effectiveSessionId}, Type=${inputData.type}`);
      await dispatch(sendMessage({
        sessionId: effectiveSessionId, message: textToSend, type: inputData.type,
        imageUrl: finalImageUrl, tempId: optimisticMessage._id,
      })).unwrap();
      setSendError(null);
    } catch (rejectedValue) {
      console.error("Send Message Thunk Rejected:", rejectedValue);
      const errorMsg = rejectedValue || 'Failed to send.';
      setSendError(errorMsg);
      // TODO: dispatch(updateOptimisticMessageState(...error...));
    } finally {
      if (isMountedRef.current) setIsSending(false);
    }
  }, [dispatch, effectiveSessionId, isSending, isAtBottom, scrollToBottom]); // Dependencies for handleSend


  // Track Scroll Position
  const handleScroll = useCallback((event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    setIsAtBottom(scrollOffset <= 20);
  }, []); // No dependencies needed


  // --- Render Functions ---
  const renderItem = useCallback(({ item }) => {
    const isUser = item.sender === 'user' || item.sender === currentUser?._id;
    return <MessageBubble messageObject={item} isUser={isUser} />;
  }, [currentUser?._id]);

  const renderListFooter = useCallback(() => {
    if (isLoadingMessages && messagesForCurrentSession?.length > 0 && IS_EXISTING_SESSION) {
      return <ActivityIndicator style={styles.listLoader} size="small" color={theme.colors.primary} />;
    }
    return null;
  }, [isLoadingMessages, messagesForCurrentSession?.length, IS_EXISTING_SESSION]);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoadingMessages && IS_EXISTING_SESSION) {
      return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centerLoader} />;
    }
    if (messagesError && IS_EXISTING_SESSION) {
      return ( <View style={styles.centerMessageContainer}><ErrorMessage message={`Error: ${messagesError}`} /></View> );
    }
    return (
      <View style={styles.centerMessageContainer}>
        <Text style={styles.emptyListText}>Start the conversation!</Text>
        <Text style={styles.emptyListSubText}>Send a message to begin chatting.</Text>
      </View>
    );
  }, [isLoadingMessages, messagesError, IS_EXISTING_SESSION]);


  // Ensure listData is always an array for FlatList
  const listData = messagesForCurrentSession || [];

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({ ios: 60, default: 0 })}
      >
        <FlatList
          ref={flatListRef}
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || `temp-${item.timestamp}`}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          inverted // Keep chat bottom-up
          onEndReached={() => { if (IS_EXISTING_SESSION) loadMoreMessages(); }} // Guarded onEndReached
          onEndReachedThreshold={0.8}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderListEmptyComponent}
          showsVerticalScrollIndicator={false}
          // Performance settings
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={21}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll} // Track scroll position
          scrollEventThrottle={100} // Throttle scroll events
        />

        {/* Input Bar Area */}
        <View>
          {sendError && ( <Text style={styles.inlineSendError}>Send Error: {sendError}</Text> )}
          <ChatInputBar onSend={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background, },
  container: { flex: 1, backgroundColor: theme.colors.background, },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  centerMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, },
  emptyListText: { color: theme.colors.muted, fontFamily: theme.typography.bodySemiBoldFontFamily, fontSize: 16, textAlign: 'center', marginBottom: theme.spacing.xs, },
  emptyListSubText: { color: theme.colors.muted, fontFamily: theme.typography.bodyFontFamily, fontSize: 14, textAlign: 'center', },
  inlineSendError: { fontSize: theme.typography.captionSize, color: theme.colors.error, textAlign: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, backgroundColor: `${theme.colors.error}15`, },
  messageList: { flex: 1, width: '100%', },
  messageListContent: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, flexGrow: 1, justifyContent: 'flex-end', },
  listLoader: { paddingVertical: theme.spacing.md, alignSelf: 'center', },
});