// FILE: src/components/common/InputField.js
import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { theme } from '../../constants'; // Import theme

export default function InputField({ style, containerStyle, error, hint, label, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { borderColor: borderColor },
          style,
        ]}
        placeholderTextColor={theme.colors.muted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        clearButtonMode="while-editing" // iOS clear button
        {...props}
      />
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {/* Error message is now handled by ErrorMessage component */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.md, // Add margin bottom to container
  },
  label: {
    fontSize: theme.typography.smallSize,
    fontFamily: theme.typography.bodySemiBoldFontFamily, // Use Inter-SemiBold
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    width: '100%',
    height: 52, // Increased height
    borderWidth: 1.5, // Slightly thicker border for focus visibility
    borderRadius: theme.borderRadius.lg, // Use theme border radius
    paddingHorizontal: theme.spacing.md, // Use theme spacing
    backgroundColor: theme.colors.inputBackground,
    fontSize: theme.typography.bodySize, // Use theme font size
    fontFamily: theme.typography.bodyFontFamily, // Use Inter-Regular
    color: theme.colors.text,
  },
  hint: {
    fontSize: theme.typography.captionSize,
    fontFamily: theme.typography.bodyFontFamily,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    paddingLeft: theme.spacing.xs,
  }
});