import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CalendarView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>[Calendar Component Placeholder]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#888',
    fontSize: 16,
  },
});
