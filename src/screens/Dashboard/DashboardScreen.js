import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Dostify!</Text>
      <Text style={styles.subtitle}>Your personalized student dashboard</Text>
      {/* Add summary cards for planner, mood, chat, etc. here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F8EF7',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
});
