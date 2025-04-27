import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/Chat/ChatScreen';
import SessionListScreen from '../screens/Chat/SessionListScreen';
import routes from '../constants/routes';

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.Chat} component={ChatScreen} options={{ title: 'Dostify AI' }} />
      <Stack.Screen name={routes.SessionList} component={SessionListScreen} options={{ title: 'Chat Sessions' }} />
    </Stack.Navigator>
  );
}
