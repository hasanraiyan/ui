// FILE: src/styles/theme.js
// (Replaces src/constants/colors.js and merges with existing theme.js)
import { Platform } from 'react-native';

const lightColors = {
  primary: '#2A9D8F', // Teal
  secondary: '#E9C46A', // Yellowish accent (Example)
  background: '#F8F9FA', // Soft Off-White
  card: '#FFFFFF',
  text: '#1C1E21', // Near Black
  muted: '#6C757D', // Grey
  border: '#CED4DA', // Light Grey for borders
  inputBackground: '#FFFFFF',
  error: '#E57373', // Soft Red
  success: '#81C784', // Soft Green
  // ... add other specific colors if needed
};

const darkColors = {
  primary: '#2A9D8F', // Teal can work in dark too, or adjust slightly if needed
  secondary: '#E9C46A',
  background: '#1A1D21', // Deep Charcoal
  card: '#2B2F36', // Slightly lighter than background
  text: '#E4E6EB', // Off-white/Light Grey
  muted: '#ADB5BD', // Lighter Grey
  border: '#495057', // Darker Grey for borders
  inputBackground: '#2B2F36',
  error: '#E57373', // Can often remain the same
  success: '#81C784', // Can often remain the same
  // ... add other specific colors if needed
};

// TODO: Add logic to select lightColors/darkColors based on system/user preference
const colors = lightColors;

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const typography = {
  // --- Font Family ---
  // Ensure 'Manrope-Bold', 'Manrope-SemiBold', 'Inter-Regular', 'Inter-SemiBold'
  // are loaded using expo-font in your App.js or equivalent setup.
  primaryFontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }), // Fallback
  secondaryFontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }), // Fallback
  headingFontFamily: 'Manrope-Bold',
  headingSemiBoldFontFamily: 'Manrope-SemiBold',
  bodyFontFamily: 'Inter-Regular',
  bodySemiBoldFontFamily: 'Inter-SemiBold',

  // --- Font Sizes ---
  h1Size: 32,
  h2Size: 28,
  h3Size: 24,
  h4Size: 20,
  bodySize: 16,
  smallSize: 14,
  captionSize: 12,

  // --- Line Heights ---
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightLoose: 1.7,
};

const theme = {
  colors,
  spacing,
  typography,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12, // Default for inputs/buttons
    xl: 16,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export default theme;

// You can delete src/constants/colors.js now
// Update src/constants/index.js if needed to only export routes and the theme
// Or adjust imports throughout the app to pull from theme instead of colors