// FILE: src/screens/Auth/SignUpScreen.js
import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { routes, theme } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]); // Clear only on mount

  const handleSignUp = async () => {
    dispatch(clearAuthError()); // Clear previous errors before attempt

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      // Consider setting this via Redux state for consistent error display
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      // TODO: Improve success feedback (e.g., snackbar, temporary message) instead of Alert
      Alert.alert(
        'Registration Successful',
        'You can now log in with your credentials.',
        [{ text: 'OK', onPress: () => navigation.navigate(routes.Login) }]
      );
    } catch (rejectedValue) {
      // Error is handled by the ErrorMessage component via Redux state
      console.error('Registration failed:', rejectedValue);
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

          <Text style={styles.title}>Create Your Account</Text>

          <ErrorMessage message={error} containerStyle={styles.errorContainer} />

          <InputField
            label="Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            containerStyle={styles.inputField}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
             returnKeyType="next"
            containerStyle={styles.inputField}
          />
          <InputField
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            hint="Minimum 8 characters" // Added hint
             returnKeyType="next"
            containerStyle={styles.inputField}
          />
          <InputField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            returnKeyType="done"
             onSubmitEditing={handleSignUp}
            containerStyle={styles.inputField}
          />

          <Button
             title="Sign Up"
             onPress={handleSignUp}
             isLoading={isLoading}
             style={styles.button}
             />

          <TouchableOpacity
             style={styles.loginLinkContainer}
             onPress={() => !isLoading && navigation.navigate(routes.Login)}>
            <Text style={styles.link}>Already have an account? <Text style={styles.linkBold}>Login</Text></Text>
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
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  errorContainer: {
      marginBottom: theme.spacing.sm,
  },
  inputField: {
    marginBottom: theme.spacing.md, // Slightly less space than Login maybe
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.lg, // Space above button
    marginBottom: theme.spacing.lg,
  },
  loginLinkContainer: {
     marginTop: theme.spacing.md,
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.bodyFontFamily,
    fontSize: theme.typography.smallSize,
    textAlign: 'center',
  },
   linkBold: {
       fontFamily: theme.typography.bodySemiBoldFontFamily,
   }
});