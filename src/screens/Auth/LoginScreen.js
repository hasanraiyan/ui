// FILE: src/screens/Auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView, // Added for smaller screens
  Image, // Added for logo
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../store/slices/authSlice';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
// Removed LoadingIndicator import, using Button's isLoading prop
import { routes, theme } from '../../constants'; // Import theme
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear error when component mounts or inputs change
    dispatch(clearAuthError());
  }, [dispatch, email, password]); // Keep dependency array minimal

  const handleLogin = () => {
    if (!email || !password) {
      // Use our ErrorMessage component indirectly via slice state if possible,
      // but Alert is okay for immediate validation feedback.
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    // Error state is managed by Redux slice via loginUser thunk
    dispatch(loginUser({ email, password }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Replace with your actual logo */}
          {/* <Image
            // source={require('../../../assets/logo.png')} // Example path
            style={styles.logo}
            resizeMode="contain"
          /> */}

          <Text style={styles.title}>Welcome Back</Text>

          <ErrorMessage message={error} containerStyle={styles.errorContainer} />

          <InputField
            label="Email" // Optional label
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            // onSubmitEditing={() => passwordInputRef.current?.focus()} // Requires useRef for password input
            containerStyle={styles.inputField}
          />
          <InputField
            label="Password" // Optional label
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin} // Submit on done
            // ref={passwordInputRef} // Requires useRef
             containerStyle={styles.inputField}
          />

          <TouchableOpacity
             style={styles.forgotPasswordLinkContainer}
             onPress={() => !isLoading && navigation.navigate(routes.ForgotPassword)}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
             title="Login"
             onPress={handleLogin}
             isLoading={isLoading}
             style={styles.button}
             />

          <TouchableOpacity
            style={styles.signUpLinkContainer}
            onPress={() => !isLoading && navigation.navigate(routes.SignUp)}>
            <Text style={styles.link}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Ensures content can scroll if needed
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl, // Generous padding
  },
   logo: {
    width: 100, // Smaller logo on login/signup
    height: 100,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.headingFontFamily, // Manrope-Bold
    fontSize: theme.typography.h2Size, // 28px
    color: theme.colors.text, // Use text color for primary heading
    marginBottom: theme.spacing.xl, // Generous margin below title
    textAlign: 'center',
  },
  errorContainer: {
      marginBottom: theme.spacing.sm, // Reduce margin if error appears above inputs
      // width: '100%', // Ensure it takes full width if needed
  },
  inputField: {
    marginBottom: theme.spacing.lg, // More space between inputs
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.sm, // Reduced margin top if forgot password is above
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordLinkContainer: {
    alignSelf: 'flex-end', // Align to the right
    marginBottom: theme.spacing.lg, // Space before the main button
    marginTop: -theme.spacing.sm, // Reduce space slightly after password input
  },
  signUpLinkContainer: {
     marginTop: theme.spacing.md, // Space after the main button
  },
  link: {
    color: theme.colors.primary,
    fontFamily: theme.typography.bodyFontFamily, // Inter-Regular
    fontSize: theme.typography.smallSize, // 14px
    textAlign: 'center',
  },
   linkBold: {
       fontFamily: theme.typography.bodySemiBoldFontFamily, // Inter-SemiBold
   }
});