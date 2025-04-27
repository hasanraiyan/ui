import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingIndicator({ size = 'large', color = '#4F8EF7', style }) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
