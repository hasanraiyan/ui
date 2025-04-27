// FILE: src/screens/Auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import * as authService from '../../services/authService';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
// Removed LoadingIndicator import
import { routes, theme } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define SuccessMessage component locally or import if common
const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
        <View style={styles.successContainer}>
             {/* Optional Icon */}
            <Text style={styles.successText}>{message}</Text>
        </View>
    );
}

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address.'); // Set local error state
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await authService.forgotPassword(email);
      setSuccessMessage(response.data.message);
      // Keep Alert for now, or replace with the inline SuccessMessage completely
      // Alert.alert('Request Sent', response.data.message);
    } catch (err) {
      const message = err.message || 'Failed to send reset link. Please check the email or try again.';
      setError(message);
      // Alert.alert('Error', message); // Error displayed by ErrorMessage component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
           {/* <Image
            // source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email below, and we'll send you instructions to reset your password.
          </Text>

          <ErrorMessage message={error} containerStyle={styles.messageContainer} />
          <SuccessMessage message={successMessage} />

          <InputField
            label="Email"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null); // Clear error on input change
              setSuccessMessage(''); // Clear success on input change
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="done"
            onSubmitEditing={handleForgotPassword}
            error={!!error} // Pass error state to InputField if needed for border styling
            containerStyle={styles.inputField}
          />

          <Button
             title="Send Instructions"
             onPress={handleForgotPassword}
             isLoading={isLoading}
             style={styles.button}
             />

          <TouchableOpacity
             style={styles.backLinkContainer}
             onPress={() => !isLoading && navigation.navigate(routes.Login)}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Use similar styles as LoginScreen, adjusting where necessary
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
   logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.headingFontFamily,
    fontSize: theme.typography.h2Size,
    color: theme.colors.text,
    marginBottom: theme.spacing.md, // Less space before subtitle
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.bodyFontFamily,
    fontSize: theme.typography.bodySize,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl, // Space before messages/input
    paddingHorizontal: theme.spacing.sm,
  },
  messageContainer: {
      marginBottom: theme.spacing.md, // Ensure space below error/success message
  },
   successContainer: {
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: `${theme.colors.success}20`, // Light green background
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  successText: {
    color: theme.colors.success, // Use theme success color
    fontSize: theme.typography.smallSize,
    fontFamily: theme.typography.bodyFontFamily,
    textAlign: 'center',
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.sm, // Reduced margin top
    marginBottom: theme.spacing.lg,
  },
  backLinkContainer: {
     marginTop: theme.spacing.md,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.bodyFontFamily,
    fontSize: theme.typography.smallSize,
    textAlign: 'center',
  },
});