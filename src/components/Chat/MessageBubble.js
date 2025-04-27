// FILE: src/components/Chat/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants'; // Assuming theme exists

const MAX_IMAGE_WIDTH = Dimensions.get('window').width * 0.65; // Max width for images

// --- Helper to render AI tool call requests ---
const RenderToolCallRequest = React.memo(({ toolCalls }) => {
    if (!toolCalls || toolCalls.length === 0) return null;
    return (
        <View style={styles.toolCallRequestContainer}>
             <Ionicons name="build-outline" size={18} color={theme.colors.primary} style={styles.toolIcon} />
            <View style={styles.toolTextContainer}>
                <Text style={styles.toolTitle}>AI Action Pending:</Text>
                {toolCalls.map((call, index) => (
                    // Use function name or generate key if id is missing (shouldn't happen often)
                    <Text key={call.id || `${call.function?.name}-${index}`} style={styles.toolMessage}>
                        - {call.function?.name || 'Unknown Action'}(...)
                    </Text>
                ))}
                 {/* You could add a spinner here too if desired */}
            </View>
        </View>
    );
});

// --- Helper to render tool results nicely ---
const RenderToolResult = React.memo(({ toolName, toolResultData }) => {
    if (!toolResultData || !toolName) return null;

    const success = toolResultData.success;
    // Provide default messages if missing
    const message = toolResultData.message || toolResultData.error || (success ? `Completed: ${toolName}` : `Failed: ${toolName}`);

    return (
        <View style={[styles.toolResultContainer, success ? styles.toolSuccess : styles.toolError]}>
            <Ionicons
                name={success ? "checkmark-circle-outline" : "alert-circle-outline"}
                size={18}
                color={success ? theme.colors.success : theme.colors.error}
                style={styles.toolIcon}
            />
            <View style={styles.toolTextContainer}>
                <Text style={styles.toolTitle}>Tool Result: {toolName}</Text>
                <Text style={styles.toolMessage}>{message}</Text>
                {/* Example: Conditionally render Task ID if available */}
                {toolResultData.taskId && (
                     <Text style={styles.toolExtraInfo}>Task ID: {toolResultData.taskId.slice(-6)}</Text>
                 )}
                {/* Example: Render list of tasks if available */}
                {toolResultData.tasks && Array.isArray(toolResultData.tasks) && (
                    <View style={styles.toolTaskList}>
                        {toolResultData.tasks.slice(0, 3).map((task) => ( // Show first 3 tasks
                            <Text key={task.id} style={styles.toolTaskItem}>- {task.title} ({task.completed ? 'Done' : 'Pending'})</Text>
                        ))}
                        {toolResultData.tasks.length > 3 && <Text style={styles.toolTaskItem}>... and more</Text>}
                    </View>
                )}
            </View>
        </View>
    );
});


// --- Main Component ---
export default React.memo(function MessageBubble({ messageObject, isUser }) { // Wrap in React.memo
  // Destructure with defaults for safety
  const {
    sender = 'ai',
    message = '',
    type = 'text', // 'text', 'image', 'tool_result', 'tool_request' (added types)
    imageUrl = null,
    timestamp, // Can be used later
    feedback, // User feedback rating (1-5)
    isLoading = false, // For optimistic UI spinner (mainly user messages)
    error = null, // Error message if sending failed (optimistic user messages)
    // Tool related fields from backend schema
    tool_calls = null, // AI requesting tool use
    tool_call_id = null, // Identifies which call this result is for
    tool_name = null, // Name of the tool executed
    toolResultData = null, // Actual result data object
    _id, // Message's unique ID (real or temporary)
  } = messageObject || {}; // Handle potential null messageObject

  const isAi = sender === 'ai';
  const isTool = sender === 'tool';

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.user : (isTool ? styles.tool : styles.ai),
    // Less padding if only image/tool result without text
    (type === 'image' || type === 'tool_result' || type === 'tool_request') && !message ? styles.contentOnlyBubble : {},
    error ? styles.errorBubble : {}, // Style failed user messages
  ];

  const textStyle = [
    styles.text,
    isUser ? styles.userText : (isTool ? styles.toolText : styles.aiText),
    type === 'image' && message ? styles.caption : {},
  ];

  // --- Render Logic ---
  return (
    <View style={bubbleStyle}>
      {/* Loading indicator for optimistic user messages */}
      {isUser && isLoading && !error && (
        <ActivityIndicator size="small" color={theme.colors.background} style={styles.loadingIndicator} />
      )}
      {/* Error indicator for optimistic user messages */}
      {isUser && error && (
          <View style={styles.errorIndicator}>
              <Ionicons name="alert-circle-outline" size={18} color={theme.colors.background} />
          </View>
      )}

      {/* Render Image if type is image and imageUrl exists */}
      {type === 'image' && imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
          // Add placeholder/loading state for images if needed
        />
      ) : null}

      {/* Render Text Message or Caption */}
      {/* Show text unless it's a content-only bubble without a message */}
      {message && !(type === 'tool_result' || type === 'tool_request') ? (
          <Text style={textStyle}>{message}</Text>
      ) : (type === 'image' && message) ? ( // Handle caption specifically
          <Text style={textStyle}>{message}</Text>
      ) : null}

       {/* Render AI Tool Call Request (if present in AI message) */}
       {isAi && tool_calls && tool_calls.length > 0 && (
           <RenderToolCallRequest toolCalls={tool_calls} />
       )}

      {/* Render Tool Result (if it's a tool message) */}
      {isTool && tool_name && toolResultData && (
          <RenderToolResult toolName={tool_name} toolResultData={toolResultData} />
      )}

      {/* TODO: Add Timestamp display */}
      {/* {timestamp && <Text style={styles.timestamp}>{new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>} */}

      {/* TODO: Add Feedback buttons for standard AI text messages */}
       {isAi && !tool_calls && message && type === 'text' && (
           <View style={styles.feedbackContainer}>
               {/* <TouchableOpacity onPress={() => console.log("Feedback Up:", _id)}>👍</TouchableOpacity>
               <TouchableOpacity onPress={() => console.log("Feedback Down:", _id)}>👎</TouchableOpacity> */}
           </View>
        )}
    </View>
  );
}); // End of React.memo wrapper

// --- Styles ---
const styles = StyleSheet.create({
  bubble: {
    maxWidth: '85%', // Allow slightly wider bubbles
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18, // Slightly more rounded
    marginVertical: 4,
    position: 'relative',
    minWidth: 50, // Minimum width for indicators
  },
  contentOnlyBubble: {
    padding: 6, // Less padding if only content (image/tool)
    backgroundColor: 'transparent', // Make image/tool background cleaner if desired
     // User/AI/Tool styles still apply for alignment and specific background overrides
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.card, // Use card background
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tool: { // Style for tool result message container
    alignSelf: 'flex-start', // Usually from AI/system side
    backgroundColor: theme.colors.background, // Use main background
    borderColor: theme.colors.border,
    borderWidth: 1,
    width: '90%', // Often wider to show more info
    maxWidth: '90%',
    marginVertical: 6,
    padding: 0, // Padding handled by inner content
    // Overwrite default bubble padding if needed for contentOnlyBubble
    // paddingVertical: 0, paddingHorizontal: 0,
  },
  errorBubble: { // Applied to user bubble on error
    backgroundColor: theme.colors.error + 'BF', // More opaque error bg
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.typography.bodyFontFamily,
  },
  userText: {
    color: theme.colors.background, // White text on primary bg
  },
  aiText: {
    color: theme.colors.text, // Standard text color
  },
  toolText: { // Default text style within tool results
      color: theme.colors.text,
      fontSize: 14, // Slightly smaller for tool results
  },
  image: {
    width: MAX_IMAGE_WIDTH,
    aspectRatio: 1, // Default aspect ratio, adjust as needed
    height: undefined,
    borderRadius: 14, // Match bubble radius more closely
    alignSelf: 'center',
    margin: 4, // Add margin around image within bubble
  },
  caption: { // Style for text accompanying an image
    fontSize: 14,
    marginTop: 4,
    paddingHorizontal: 4, // Add padding if text is below image in bubble
    color: theme.colors.muted, // Muted color for captions
    fontStyle: 'italic',
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 8,
    right: -24, // Position outside the bubble
  },
   errorIndicator: {
    position: 'absolute',
    bottom: 8,
    right: -22,
  },
   timestamp: {
    fontSize: 10,
    fontFamily: theme.typography.bodyFontFamily,
    color: theme.colors.muted,
    alignSelf: 'flex-end', // Align timestamp to the right
    marginTop: 4,
    marginRight: 4,
  },
   feedbackContainer: { // Placeholder for feedback buttons
     flexDirection: 'row',
     justifyContent: 'flex-end',
     marginTop: 6,
     opacity: 0.6,
   },
   // --- Tool Call/Result Styles ---
   toolIcon: { marginRight: theme.spacing.sm, },
   toolTextContainer: { flex: 1, },
   toolTitle: { fontFamily: theme.typography.bodySemiBoldFontFamily, fontSize: 13, marginBottom: 3, color: theme.colors.text, opacity: 0.8 },
   toolMessage: { fontFamily: theme.typography.bodyFontFamily, fontSize: 14, color: theme.colors.text },
   toolExtraInfo: { fontFamily: theme.typography.bodyFontFamily, fontSize: 11, color: theme.colors.muted, marginTop: 4 },
   toolTaskList: { marginTop: 6, paddingLeft: theme.spacing.sm, },
   toolTaskItem: { fontFamily: theme.typography.bodyFontFamily, fontSize: 13, color: theme.colors.text, marginBottom: 2, },
   toolCallRequestContainer: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      marginTop: theme.spacing.xs,
      borderRadius: theme.borderRadius.md - 4,
      backgroundColor: `${theme.colors.primary}1A`, // Light primary bg
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
   },
   toolResultContainer: {
     flexDirection: 'row',
     padding: theme.spacing.sm,
     // No margin needed as it's inside the main 'tool' bubble style
     // marginTop: theme.spacing.xs,
     borderRadius: theme.borderRadius.lg, // Match bubble radius
     borderWidth: 1,
   },
   toolSuccess: {
      backgroundColor: `${theme.colors.success}1A`, // Light green bg
      borderColor: `${theme.colors.success}40`,
   },
   toolError: {
      backgroundColor: `${theme.colors.error}1A`, // Light red bg
      borderColor: `${theme.colors.error}40`,
   },
});