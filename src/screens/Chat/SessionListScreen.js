// FILE: src/screens/Chat/SessionListScreen.js
import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import Redux Actions & Selectors
import { fetchSessions } from '../../store/slices/chatSlice';

// Import Components & Constants
import ErrorMessage from '../../components/common/ErrorMessage';
import { routes, theme } from '../../constants';

export default function SessionListScreen({ navigation }) {
  const dispatch = useDispatch();
  const {
    sessions,
    isSessionListLoading,
    sessionListError,
  } = useSelector((state) => state.chat);

  const isMountedRef = useRef(false);
  const hasCheckedSessionsRef = useRef(false); // Flag to prevent multiple redirect attempts

  // --- Fetching Logic ---
  const loadSessions = useCallback((isRefreshing = false) => {
    if (!isRefreshing) {
        hasCheckedSessionsRef.current = false; // Reset check flag only on normal load/focus
    }
    console.log('SessionListScreen: Dispatching fetchSessions...');
    dispatch(fetchSessions());
  }, [dispatch]);

  // Initial Load and Focus Listener
  useEffect(() => {
    isMountedRef.current = true;
    console.log("SessionListScreen Mounted.");
    loadSessions(); // Initial load

    const unsubscribeFocus = navigation.addListener('focus', () => {
       if (isMountedRef.current) {
           console.log('SessionListScreen: Focused. Reloading sessions.');
           loadSessions(); // Reload on focus
       }
    });

     return () => {
        isMountedRef.current = false;
        console.log("SessionListScreen Unmounted.");
        unsubscribeFocus();
     };
  }, [navigation, loadSessions]);

  // --- Redirect Logic ---
  useEffect(() => {
     // Check only when loading finishes and check hasn't been done for this cycle
     const canCheckForRedirect = isMountedRef.current && !isSessionListLoading && !hasCheckedSessionsRef.current;

     if (canCheckForRedirect) {
        hasCheckedSessionsRef.current = true; // Mark check as done
        console.log(`SessionListScreen: Checking redirect. Error: ${sessionListError}, Sessions Count: ${sessions?.length}`);

        if (!sessionListError && sessions && sessions.length === 0) {
            // --- Condition Met: Load successful, no error, empty list ---
            console.log('SessionListScreen: No sessions found. Redirecting to new chat.');
            navigation.replace(routes.Chat, { // Use replace to remove list from history
                sessionId: null,
                sessionTitle: 'New Chat',
            });
        }
        // Otherwise, stay on this screen (show list or error)
     }
  }, [isSessionListLoading, sessions, sessionListError, navigation]);

  // --- Render Functions ---
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => {
        console.log(`Navigating to existing chat session: ${item.sessionId}`);
        navigation.navigate('ChatStack', {
          screen: 'Chat',
          params: {
            sessionId: item.sessionId,
            sessionTitle: item.title || `Chat`,
          },
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.sessionTextContainer}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title || `Chat Session`}
        </Text>
        <Text style={styles.sessionInfo}>
           Last active: {item.lastActivity ? new Date(item.lastActivity).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <View style={styles.sessionMetaContainer}>
         <Text style={styles.sessionInfo}>{item.messageCount || 0} msgs</Text>
         <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
      </View>
    </TouchableOpacity>
  );

  const renderListEmptyComponent = () => {
     // Don't show empty state while loading or if an error occurred (error shown separately)
     if (isSessionListLoading || sessionListError) return null;
     // This state should only be visible briefly before redirect happens if list is empty
     return (
        <View style={styles.emptyContainer}>
           <Text style={styles.emptySubText}>Checking for chats...</Text>
        </View>
     );
  };

  // --- Main Render ---

  // Initial full screen loader
   const showInitialLoader = isSessionListLoading && sessions === null; // Or based on initial state
   if (showInitialLoader) {
      return (
          <SafeAreaView style={styles.safeArea}>
              <ActivityIndicator style={styles.fullScreenLoader} size="large" color={theme.colors.primary} />
          </SafeAreaView>
      );
   }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      {/* Error Display Area */}
      {sessionListError && !isSessionListLoading && ( // Show error only when not loading
        <View style={styles.errorContainer}>
          <ErrorMessage message={`Error loading sessions: ${sessionListError}`} />
          <TouchableOpacity onPress={() => loadSessions(true)} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Session List (Show only if no error) */}
       {!sessionListError && (
          <FlatList
             data={sessions || []} // Handle null state defensively
             renderItem={renderItem}
             keyExtractor={(item) => item.sessionId}
             ListEmptyComponent={renderListEmptyComponent}
             contentContainerStyle={styles.listContainer}
             showsVerticalScrollIndicator={false}
             refreshControl={
               <RefreshControl
                 refreshing={isSessionListLoading && sessions !== null} // Show pull-refresh spinner
                 onRefresh={() => loadSessions(true)}
                 tintColor={theme.colors.primary}
                 colors={[theme.colors.primary]}
               />
             }
          />
        )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  fullScreenLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
  retryButton: { marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, backgroundColor: theme.colors.primary + '20', borderRadius: theme.borderRadius.md },
  retryText: { color: theme.colors.primary, fontFamily: theme.typography.bodySemiBoldFontFamily },
  listContainer: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, flexGrow: 1 },
  sessionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.card, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md, ...theme.shadows.soft },
  sessionTextContainer: { flex: 1, marginRight: theme.spacing.sm },
  sessionTitle: { fontSize: 16, fontFamily: theme.typography.bodySemiBoldFontFamily, color: theme.colors.text, marginBottom: 4 },
  sessionInfo: { fontSize: 12, fontFamily: theme.typography.bodyFontFamily, color: theme.colors.muted },
  sessionMetaContainer: { flexDirection: 'row', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, marginTop: '30%' },
  emptySubText: { fontSize: 14, fontFamily: theme.typography.bodyFontFamily, color: theme.colors.muted, textAlign: 'center' },
});