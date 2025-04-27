import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { storage } from '../../utils/storage'; 
import { login } from '../../store/slices/authSlice'; 

export default function SplashScreen({ navigation }) { 
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userSession = await storage.get('userSession'); 

        if (userSession && userSession.token) {

          dispatch(login(userSession.user)); 
        } else {
          navigation.replace('Login'); 
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(() => {
        checkAuth();
    }, 1500); 

    return () => clearTimeout(timer); 

  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F8EF7" />
      
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
});