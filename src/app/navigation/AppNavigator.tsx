import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import type { RootStackParamList } from '@/app/navigation/types';
import { RatingsBarnListScreen } from '@/features/ratings/screens/RatingsBarnListScreen';
import { RatingsEditScreen } from '@/features/ratings/screens/RatingsEditScreen';
import { RatingsHomeScreen } from '@/features/ratings/screens/RatingsHomeScreen';
import { RatingsInputScreen } from '@/features/ratings/screens/RatingsInputScreen';
import { RatingsReportingPageScreen } from '@/features/ratings/screens/RatingsReportingPageScreen';
import { RatingsReportsScreen } from '@/features/ratings/screens/RatingsReportsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="RatingsHome"
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="RatingsHome" component={RatingsHomeScreen} options={{ title: 'Ratings' }} />
      <Stack.Screen
        name="RatingsInput"
        component={RatingsInputScreen}
        options={{ title: 'Ratings Input' }}
      />
      <Stack.Screen
        name="RatingsEdit"
        component={RatingsEditScreen}
        options={{ title: 'Ratings Edit' }}
      />
      <Stack.Screen
        name="RatingsBarnList"
        component={RatingsBarnListScreen}
        options={{ title: 'Barn List' }}
      />
      <Stack.Screen
        name="RatingsReports"
        component={RatingsReportsScreen}
        options={{ title: 'Ratings Reports' }}
      />
      <Stack.Screen
        name="RatingsReportingPage"
        component={RatingsReportingPageScreen}
        options={{ title: 'Report Builder' }}
      />
    </Stack.Navigator>
  );
};
