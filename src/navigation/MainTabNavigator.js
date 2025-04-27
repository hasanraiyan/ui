import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardStack from './DashboardStack';
import ChatStack from './ChatStack';
import PlannerStack from './PlannerStack';
import MoodStack from './MoodStack';
import SettingsStack from './SettingsStack';

import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'PlannerTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MoodTab') {
            iconName = focused ? 'happy' : 'happy-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ChatTab" component={ChatStack} options={{ title: 'Chat' }} />
      <Tab.Screen name="PlannerTab" component={PlannerStack} options={{ title: 'Planner' }} />
      <Tab.Screen name="MoodTab" component={MoodStack} options={{ title: 'Mood' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
