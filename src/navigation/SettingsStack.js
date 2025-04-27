import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfileScreen from '../screens/Settings/ProfileScreen';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import routes from '../constants/routes';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.Settings} component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name={routes.Profile} component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name={routes.ChangePassword} component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
    </Stack.Navigator>
  );
}
