import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Detail</Text>
      {/* Task detail info will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F8EF7',
  },
});
