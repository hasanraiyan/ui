// FILE: src/components/Chat/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Dimensions } from 'react-native';
import { theme } from '../../constants'; // Assuming theme exists

const MAX_IMAGE_WIDTH = Dimensions.get('window').width * 0.65; // Max width for images

export default function MessageBubble({ messageObject, isUser }) {
  // Destructure with defaults for safety
  const {
      message = '',
      type = 'text',
      imageUrl = null,
      sender = 'ai', // Default to AI if sender is missing
      isLoading = false, // For optimistic UI spinner
      // timestamp, feedback etc. can be added later
    } = messageObject || {}; // Handle potential null messageObject

  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.user : styles.ai,
    // Special styling if only image without text?
    type === 'image' && !message ? styles.imageOnlyBubble : {},
  ];

  const textStyle = [
    styles.text,
    isUser ? styles.userText : styles.aiText,
    type === 'image' && message ? styles.caption : {}, // Style caption differently
  ];

  return (
    <View style={bubbleStyle}>
       {/* Show loading indicator for user messages being sent */}
       {isUser && isLoading && (
         <ActivityIndicator size="small" color={theme.colors.background || '#fff'} style={styles.loadingIndicator} />
       )}

      {/* Render Image if type is image and imageUrl exists */}
      {type === 'image' && imageUrl ? (
        <Image
          source={{ uri: imageUrl }} // React Native Image handles http/https/data URIs
          style={styles.image}
          resizeMode="contain" // Contain ensures the whole image is visible
           // You might want a placeholder while the image loads, especially for network URLs
           // Placeholder example (requires installing a library or using a simple View):
           // PlaceholderContent={<ActivityIndicator size="small" color="#ccc" />}
        />
      ) : null}

      {/* Render text message or caption if message exists */}
      {message ? (
        <Text style={textStyle}>{message}</Text>
      ) : null}

       {/* TODO: Add timestamp, feedback buttons later */}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%', // Allow slightly wider bubbles
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 4,
    position: 'relative', // Needed for absolute positioning of indicator
  },
  imageOnlyBubble: {
    padding: 4, // Less padding if only image
    backgroundColor: 'transparent', // Cleaner look for image only
    // Ensure user/ai styles still apply for alignment
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary || '#4F8EF7',
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.muted + '30' || '#f1f1f1', // Lighter grey
  },
  text: {
    fontSize: 16,
    lineHeight: 22, // Improve readability
  },
  userText: {
    color: theme.colors.background || '#fff',
  },
  aiText: {
    color: theme.colors.text || '#222',
  },
  image: {
    width: MAX_IMAGE_WIDTH, // Responsive width
    aspectRatio: 1, // Assume square aspect ratio, adjust if needed or get from image data
    height: undefined, // Let height be determined by aspect ratio
    borderRadius: 12,
    alignSelf: 'center', // Center image within the bubble
  },
  caption: {
    fontSize: 14,
    marginTop: 4, // Space between image and caption
    // Optional: Make caption lighter or italic
    // color: isUser ? theme.colors.background + 'aa' : theme.colors.muted,
    // fontStyle: 'italic',
  },
  loadingIndicator: {
    position: 'absolute',
    // Position differently for user vs AI?
    bottom: 6, // Example position
    right: -20, // Example position outside bubble
  },
});