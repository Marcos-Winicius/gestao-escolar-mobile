import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { criarTabelas, deleteTabelas } from './database/db';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const initializeDB = async () => {
      await criarTabelas();
    };
    initializeDB();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
