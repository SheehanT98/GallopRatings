import './global.css';
import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { AppNavigator } from '@/app/navigation/AppNavigator';
import { AppProviders } from '@/app/providers/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <AppNavigator />
    </AppProviders>
  );
}
