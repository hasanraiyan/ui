import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatScreen from '../screens/Chat/ChatScreen';
import SessionListScreen from '../screens/Chat/SessionListScreen';
import { theme } from '../constants';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator that shows the ChatScreen
function ChatStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ navigation, route }) => ({
          title: route.params?.sessionTitle || 'Chat',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: theme.spacing.sm }}>
              <Ionicons name="menu" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

// Drawer Navigator that wraps the Chat Stack
export default function ChatDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SessionListScreen {...props} />}
      screenOptions={{
        headerShown: false, // We'll show header in stack only
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.1)',
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: 320,
        },
      }}
    >
      <Drawer.Screen name="ChatStack" component={ChatStackScreen} />
    </Drawer.Navigator>
  );
}
