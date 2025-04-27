import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoodLoggingScreen from '../screens/Mood/MoodLoggingScreen';
import MoodHistoryScreen from '../screens/Mood/MoodHistoryScreen';
import routes from '../constants/routes';

const Stack = createNativeStackNavigator();

export default function MoodStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.Mood} component={MoodLoggingScreen} options={{ title: 'Log Mood' }} />
      <Stack.Screen name={routes.MoodHistory} component={MoodHistoryScreen} options={{ title: 'Mood History' }} />
    </Stack.Navigator>
  );
}
