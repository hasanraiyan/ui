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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return true; // No permissions needed for web
  };

  const handleAttachPress = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Optional: allow editing
      aspect: [4, 3], // Optional: aspect ratio
      quality: 0.8, // Reduce quality slightly to manage Base64 size
       // **IMPORTANT: Base64 is requested here, but we primarily use the URI for the flow**
       // We'll read the file content again using FileSystem just before sending if needed
       // Base64 from picker can sometimes be unreliable or very large.
      // base64: true,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setText(''); // Clear text when image is selected (optional behavior)
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleSend = () => {
    if (selectedImageUri) {
      // Pass the local URI, ChatScreen will handle Base64 conversion
      onSend({ type: 'image', uri: selectedImageUri, text: text.trim() });
      setSelectedImageUri(null);
      setText('');
    } else if (text.trim()) {
      onSend({ type: 'text', text: text.trim() });
      setText('');
    }
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
        </View>
      )}
      {/* Input Bar */}
      <View style={styles.container}>
         <TouchableOpacity onPress={handleAttachPress} style={styles.attachButton}>
           <Ionicons name="attach" size={26} color={theme.colors.primary || '#4F8EF7'} />
         </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder={selectedImageUri ? "Add a caption..." : "Type a message..."}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend} // Only triggers send on keyboard 'send' if no image
          returnKeyType="send"
          blurOnSubmit={false} // Keep keyboard open potentially
          multiline // Allow multiline input
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
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
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    left: 45, // Adjust position overlap
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10, // Adjust padding for potentially taller input
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
   attachButton: {
    paddingHorizontal: 8, // Add some padding
   },
  input: {
    flex: 1,
    minHeight: 40, // Minimum height
    maxHeight: 120, // Max height before scrolling
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10, // Adjust for multiline
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    padding: 6,
  },
});