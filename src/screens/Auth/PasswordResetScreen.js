import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as authService from '../../services/authService'; // Import service directly
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { routes } from '../../constants';
import colors from '../../constants/colors';

// This screen expects the reset token to be passed via navigation params
// e.g., navigation.navigate(routes.PasswordReset, { token: 'reset_token_from_email' })
// You'll need to set up deep linking to handle opening this screen from an email link.

export default function PasswordResetScreen({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Use local state
  const [error, setError] = useState(null); // Use local state

  // Get the token from route params
  const token = route.params?.token;

  const handleResetPassword = async () => {
    if (!token) {
      setError('Password reset token is missing or invalid. Please request a new link.');
      Alert.alert('Error', 'Password reset token is missing or invalid.');
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }
     if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the service function directly
      const response = await authService.resetPassword(token, password);
      Alert.alert(
        'Success',
        response.data.message || 'Password reset successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate(routes.Login) }]
      );
    } catch (err) {
      const message = err.message || 'Failed to reset password. The link might be invalid or expired.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>

      <ErrorMessage message={error} />

      <InputField
        placeholder="New Password (min. 8 characters)"
        value={password}
        onChangeText={(text) => {
            setPassword(text);
            setError(null); // Clear error on input change
        }}
        secureTextEntry
      />
      <InputField
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={(text) => {
            setConfirmPassword(text);
            setError(null); // Clear error on input change
        }}
        secureTextEntry
      />

      {isLoading ? (
        <LoadingIndicator size="small" style={styles.loading} />
      ) : (
         <Button title="Reset Password" onPress={handleResetPassword} disabled={isLoading} style={styles.button} />
      )}

      <TouchableOpacity onPress={() => !isLoading && navigation.navigate(routes.Login)}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.primary,
    textAlign: 'center',
  },
    subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  link: {
    color: colors.primary,
    marginTop: 12,
    fontSize: 16,
  },
  loading: {
    marginVertical: 20,
  },
});