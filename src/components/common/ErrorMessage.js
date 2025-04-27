// FILE: src/components/common/ErrorMessage.js
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { theme } from '../../constants'; // Import theme

export default function ErrorMessage({ message, style, containerStyle }) {
  if (!message) return null;
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} style={styles.icon} />
      <Text style={[styles.error, style]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md, // Consistent margin
    paddingHorizontal: theme.spacing.sm, // Optional padding
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  error: {
    color: theme.colors.error, // Use theme error color
    fontSize: theme.typography.smallSize, // 14px
    fontFamily: theme.typography.bodyFontFamily, // Inter-Regular
    flexShrink: 1, // Allow text to wrap
  },
});