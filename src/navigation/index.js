import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  // Example: use auth state to decide which navigator
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
