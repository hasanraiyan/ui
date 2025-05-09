import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChangePasswordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      {/* Change password form will go here */}
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
