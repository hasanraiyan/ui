// src/navigation/index.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';
import { setCredentials, logout } from '../store/slices/authSlice';
import { storage } from '../utils/storage';

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
        dispatch(logout());
      }
    };
    bootstrapAsync();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return userToken == null ? <AuthNavigator /> : <MainTabNavigator />;
}