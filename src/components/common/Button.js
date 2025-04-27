// FILE: src/components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../constants'; // Import theme

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  isLoading = false,
  ...props
}) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled || isLoading ? styles.disabled : {},
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8} // Consistent press feedback
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={styles[`text_${variant}`]?.color || theme.colors.background} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Define base styles and variants
const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.lg, // Use theme border radius
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // To accommodate loader
  },
  text: {
    textAlign: 'center',
  },

  // Sizes
  button_small: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  button_medium: { paddingVertical: 15, paddingHorizontal: theme.spacing.lg }, // Adjusted padding for 52px height goal
  button_large: { paddingVertical: theme.spacing.md + 2, paddingHorizontal: theme.spacing.xl },

  text_small: { fontSize: theme.typography.smallSize, fontFamily: theme.typography.bodySemiBoldFontFamily },
  text_medium: { fontSize: theme.typography.bodySize, fontFamily: theme.typography.bodySemiBoldFontFamily }, // 16px Semibold
  text_large: { fontSize: theme.typography.h4Size, fontFamily: theme.typography.bodySemiBoldFontFamily },

  // Variants
  button_primary: { backgroundColor: theme.colors.primary },
  text_primary: { color: theme.colors.background }, // White text

  button_secondary: { backgroundColor: theme.colors.muted }, // Example
  text_secondary: { color: theme.colors.background }, // Example

  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  text_outline: { color: theme.colors.primary },

  button_ghost: { backgroundColor: 'transparent' },
  text_ghost: { color: theme.colors.primary },

  // Disabled state
  disabled: {
    opacity: 0.6,
  },
});