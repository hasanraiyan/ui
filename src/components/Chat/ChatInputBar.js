// FILE: src/components/Chat/ChatInputBar.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../constants'; // Assuming theme exists

// Define the expected shape of the data passed to onSend
// type MessageInputData =
//   | { type: 'text'; text: string }
//   | { type: 'image'; uri: string; text?: string };

export default function ChatInputBar({ onSend }) {
  const [text, setText] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState(null); // Store local URI for preview

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      // Use specific permission request for newer Expo SDKs/iOS versions if needed
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
       // Optional: Request camera permissions if you add a camera option
       // const { cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
       // if (cameraStatus !== 'granted') { ... }
      return true;
    }
    return true; // No permissions needed for web usually
  };

  const handleAttachPress = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8, // Reduce quality slightly for faster uploads
          // base64: false, // Don't include base64 unless absolutely necessary
        });

        // Check if cancelled and access assets array (newer SDKs)
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setSelectedImageUri(result.assets[0].uri);
          // setText(''); // Optional: Clear text when image is selected
        }
    } catch (error) {
        console.error("Image Picker Error:", error);
        Alert.alert("Image Error", "Could not select image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleSendPress = () => {
    if (selectedImageUri) {
      // Pass the local URI, ChatScreen will handle upload/sending
      onSend({ type: 'image', uri: selectedImageUri, text: text.trim() });
      setSelectedImageUri(null);
      setText('');
    } else if (text.trim()) {
      onSend({ type: 'text', text: text.trim() });
      setText('');
    }
     // Don't dismiss keyboard here, ChatScreen handles it
  };

  return (
    <View>
      {/* Image Preview Area */}
      {selectedImageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
          <TouchableOpacity onPress={handleRemoveImage} style={styles.removeButton}>
            <Ionicons name="close-circle" size={24} color={theme.colors.muted || '#888'} />
          </TouchableOpacity>
          {/* Optional: Show caption input clearly */}
           <Text style={styles.previewCaptionHint}>Image selected</Text>
        </View>
      )}
      {/* Input Bar */}
      <View style={styles.container}>
         <TouchableOpacity onPress={handleAttachPress} style={styles.attachButton}>
           <Ionicons name="attach" size={26} color={theme.colors.primary || '#4F8EF7'} />
         </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={selectedImageUri ? "Add an optional caption..." : "Type a message..."}
          value={text}
          onChangeText={setText}
          // onSubmitEditing={handleSendPress} // Trigger send on keyboard 'send' only if no image? Might be confusing.
          returnKeyType="default" // Change to default or next if needed elsewhere
          blurOnSubmit={false} // Keep keyboard open potentially
          multiline // Allow multiline input
          maxHeight={120} // Prevent input from growing too large
        />
        <TouchableOpacity onPress={handleSendPress} style={styles.sendButton} disabled={!text.trim() && !selectedImageUri}>
          <Ionicons name="send" size={24} color={theme.colors.primary || '#4F8EF7'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.colors.background, // Match input bg
    borderTopWidth: 1,
    borderColor: theme.colors.border, // Match border
  },
  previewImage: {
    width: 40, // Smaller preview
    height: 40,
    borderRadius: 6,
    marginRight: 8,
  },
   previewCaptionHint: {
       fontSize: 12,
       color: theme.colors.muted,
       flex: 1, // Take remaining space
   },
  removeButton: {
    position: 'absolute',
    top: -5, // Adjust position
    left: 30,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 1, // Add padding for easier tap target
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically, esp. for multiline input
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6, // Adjust vertical padding per platform
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card, // Or background
  },
   attachButton: {
    padding: 8, // Easier tap target
   },
  input: {
    flex: 1,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 20, // Rounded corners
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 8, // Adjust padding top for diff platforms
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    marginHorizontal: 8,
    fontSize: 16,
    fontFamily: theme.typography.bodyFontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.background, // Inner input background
     minHeight: 44, // Good minimum height
     maxHeight: 120,
  },
  sendButton: {
    padding: 8, // Easier tap target
  },
});