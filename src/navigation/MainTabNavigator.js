import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardStack from './DashboardStack';
import ChatStack from './ChatStack';
import PlannerStack from './PlannerStack';
import MoodStack from './MoodStack';
import SettingsStack from './SettingsStack';
import CustomTabBar from '../components/navigation/CustomTabBar';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarIcon is now handled by CustomTabBar
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      })}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ChatTab" component={ChatStack} options={{ title: 'Chat' }} />
      <Tab.Screen name="PlannerTab" component={PlannerStack} options={{ title: 'Planner' }} />
      <Tab.Screen name="MoodTab" component={MoodStack} options={{ title: 'Mood' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
