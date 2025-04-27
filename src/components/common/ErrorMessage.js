import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ErrorMessage({ message, style }) {
  if (!message) return null;
  return <Text style={[styles.error, style]}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: '#ff3333',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
});
