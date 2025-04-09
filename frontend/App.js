// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { ChatProvider } from './contexts/ChatContext';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ChatProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </ChatProvider>
  );
}
