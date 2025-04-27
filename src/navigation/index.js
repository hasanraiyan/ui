import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/slices/authSlice';
import { storage } from '../utils/storage';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { userToken, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await storage.get('authToken');
        if (token) {
          const userData = await storage.get('userData');
          dispatch(setCredentials({ user: userData, userToken: token }));
        } else {
          dispatch(logout());
        }
      } catch (e) {
        console.error("Restoring token failed", e);
        dispatch(logout());
      }
    };
    bootstrapAsync();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      {userToken == null ? (
        <AuthNavigator />
      ) : (
        <MainTabNavigator />
      )}
    </>
  );
}
