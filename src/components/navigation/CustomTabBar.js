import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const TAB_ICONS = {
  DashboardTab: 'home',
  ChatTab: 'chatbubbles',
  PlannerTab: 'calendar',
  MoodTab: 'happy',
  SettingsTab: 'settings',
};

const TAB_LABELS = {
  DashboardTab: 'Home',
  ChatTab: 'Chat',
  PlannerTab: 'Planner',
  MoodTab: 'Mood',
  SettingsTab: 'Settings',
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {/* Tabs */}
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : TAB_LABELS[route.name] || route.name;

          const isFocused = state.index === index;
          const iconName =
            TAB_ICONS[route.name] + (isFocused ? '' : '-outline');

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={26}
                color={isFocused ? colors.primary : colors.muted}
                style={isFocused && styles.iconFocused}
              />
              <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
  },
  menuIcon: {
    color: '#333',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#eee',
    height: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    fontWeight: '500',
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '700',
  },
});
