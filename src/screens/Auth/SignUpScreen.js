import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { routes } from '../../constants';
import colors from '../../constants/colors';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear error when component mounts or inputs change
    dispatch(clearAuthError());
  }, [dispatch, name, email, password, confirmPassword]);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
        Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
        return;
    }

    dispatch(clearAuthError());
    try {
      // Use unwrap to handle promise resolution/rejection from the thunk
      await dispatch(registerUser({ name, email, password })).unwrap();
      // If registerUser succeeds (doesn't throw), show success and navigate
      Alert.alert(
        'Registration Successful',
        'You can now log in with your credentials.',
        [{ text: 'OK', onPress: () => navigation.navigate(routes.Login) }]
      );
    } catch (rejectedValue) {
      // Error is already set in the slice, ErrorMessage component will display it.
      // We catch here primarily to prevent the success alert from showing.
      console.error('Registration failed:', rejectedValue);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <ErrorMessage message={error} />

      <InputField
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="name"
      />
      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <InputField
        placeholder="Password (min. 8 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
       <InputField
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {isLoading ? (
        <LoadingIndicator size="small" style={styles.loading} />
      ) : (
         <Button title="Sign Up" onPress={handleSignUp} disabled={isLoading} style={styles.button} />
      )}

      <TouchableOpacity onPress={() => !isLoading && navigation.navigate(routes.Login)}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
    marginBottom: 32,
    color: colors.primary,
    textAlign: 'center',
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