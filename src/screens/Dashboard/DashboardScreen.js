import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import Button from '../../components/common/Button'; // Import Button component
import { logout } from '../../store/slices/authSlice'; // Import logout action
import colors from '../../constants/colors'; // Import colors

export default function DashboardScreen() {
  const dispatch = useDispatch();
  // Optionally, get user info to display name
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    // The RootNavigator will automatically switch to AuthNavigator
    // because userToken will become null in the Redux state.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{user?.name ? `, ${user.name}` : ' to Dostify'}!</Text>
      <Text style={styles.subtitle}>Your personalized student dashboard</Text>

      {/* Add summary cards for planner, mood, chat, etc. here */}
      {/* ... placeholder for future content ... */}


      {/* Add Logout Button */}
      <Button
        title="Log Out"
        onPress={handleLogout}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove center to place button at bottom
    alignItems: 'center',
    backgroundColor: colors.background, // Use theme color
    padding: 20,
    paddingTop: 60, // Add padding top for content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary, // Use theme color
    marginBottom: 8, // Reduced margin
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text, // Use theme color
    marginBottom: 40, // Add more space before potential content/logout button
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 'auto', // Push button towards the bottom
    marginBottom: 30, // Add some space from the bottom edge
    backgroundColor: colors.error, // Use error color for logout
    width: '80%', // Make button slightly narrower
    paddingVertical: 12, // Adjust padding
  },
  logoutButtonText: {
    fontSize: 16,
  }
});