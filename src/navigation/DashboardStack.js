import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
// Add other Dashboard-related screens as needed
import routes from '../constants/routes';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.Dashboard} component={DashboardScreen} options={{ title: 'Dashboard' }} />
      {/* Add other screens here */}
    </Stack.Navigator>
  );
}
