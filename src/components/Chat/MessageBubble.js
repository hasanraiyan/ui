import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isUser }) {
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.ai]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F8EF7',
  },
  ai: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  text: {
    color: '#222',
    fontSize: 16,
  },
});
