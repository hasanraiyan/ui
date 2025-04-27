// FILE: src/screens/Auth/PasswordResetScreen.js
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
import { routes, theme } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PasswordResetScreen({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = route.params?.token;

  const handleResetPassword = async () => {
    setError(null); // Clear previous errors

    if (!token) {
      setError('Password reset link is invalid or missing. Please request a new one.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, password);
      Alert.alert(
        'Success',
        response.data.message || 'Password reset successfully.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate(routes.Login) }]
      );
    } catch (err) {
      const message = err.message || 'Failed to reset password. The link might be invalid, expired, or already used.';
      setError(message);
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
          <Image
             // source={require('../../../assets/logo.png')}
             style={styles.logo}
             resizeMode="contain"
           />

          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>
            Create a new secure password for your account.
          </Text>

          <ErrorMessage message={error} containerStyle={styles.messageContainer} />

          <InputField
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            secureTextEntry
            hint="Minimum 8 characters"
            error={!!error && (error.includes('least 8') || error.includes('match'))} // Highlight on relevant errors
            returnKeyType="next"
            containerStyle={styles.inputField}
          />
          <InputField
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            secureTextEntry
            error={!!error && error.includes('match')} // Highlight on mismatch error
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
            containerStyle={styles.inputField}
          />

          <Button
             title="Set New Password"
             onPress={handleResetPassword}
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

// Use similar styles as ForgotPasswordScreen
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
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.bodyFontFamily,
    fontSize: theme.typography.bodySize,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  messageContainer: {
      marginBottom: theme.spacing.md,
  },
  inputField: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.sm,
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