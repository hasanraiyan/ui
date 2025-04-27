import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoodSelector() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>[Mood Selector Placeholder]</Text>
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
