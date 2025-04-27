import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { routes } from '../../constants';
import colors from '../../constants/colors'; // Import colors

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear error when component mounts or email/password changes
    dispatch(clearAuthError());
  }, [dispatch, email, password]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    dispatch(clearAuthError()); // Clear previous errors before attempting login
    dispatch(loginUser({ email, password }));
    // Navigation to MainTabNavigator is handled by RootNavigator based on userToken change
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Dostify</Text>

      <ErrorMessage message={error} />

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      {isLoading ? (
        <LoadingIndicator size="small" style={styles.loading} />
      ) : (
        <Button title="Login" onPress={handleLogin} disabled={isLoading} style={styles.button} />
      )}

      <TouchableOpacity onPress={() => !isLoading && navigation.navigate(routes.ForgotPassword)}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => !isLoading && navigation.navigate(routes.SignUp)}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
    backgroundColor: colors.background, // Use theme color
  },
  title: {
    fontSize: 28, // Slightly larger
    fontWeight: 'bold',
    marginBottom: 32,
    color: colors.primary, // Use theme color
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 8, // Add some margin top
    marginBottom: 16,
  },
  link: {
    color: colors.primary, // Use theme color
    marginTop: 12, // Increased margin
    fontSize: 16,
  },
  loading: {
    marginVertical: 20, // Add space for loading indicator
  },
});