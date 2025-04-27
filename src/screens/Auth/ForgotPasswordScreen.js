import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as authService from '../../services/authService'; // Import service directly
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { routes } from '../../constants';
import colors from '../../constants/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Use local loading state
  const [error, setError] = useState(null); // Use local error state
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Call the service function directly
      const response = await authService.forgotPassword(email);
      setSuccessMessage(response.data.message); // Show success message from API
      Alert.alert('Request Sent', response.data.message);
    } catch (err) {
      const message = err.message || 'Failed to send reset link. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we'll send you a link to reset your password.
      </Text>

      {/* Show local error or success message */}
      <ErrorMessage message={error} />
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
            setEmail(text);
            setError(null); // Clear error on input change
            setSuccessMessage('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {isLoading ? (
        <LoadingIndicator size="small" style={styles.loading} />
      ) : (
         <Button title="Send Reset Link" onPress={handleForgotPassword} disabled={isLoading} style={styles.button} />
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
    paddingHorizontal: 10,
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
  successText: {
      color: 'green',
      fontSize: 16,
      marginBottom: 12,
      textAlign: 'center',
  }
});