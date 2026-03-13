import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { NavCard } from '@/components/ui/NavCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsHome'>;

export const RatingsHomeScreen = ({ navigation }: Props) => {
  const { isDesktop } = useResponsiveLayout();

  return (
    <ScreenContainer>
      <View
        style={{
          width: '100%',
          maxWidth: isDesktop ? 420 : '100%',
          alignSelf: 'center',
          gap: 12,
        }}
      >
        <NavCard title="Ratings Input" onPress={() => navigation.navigate('RatingsInput')} />
        <NavCard
          title="Generate Barn List"
          onPress={() => navigation.navigate('RatingsBarnList')}
        />
        <NavCard title="Report Builder" onPress={() => navigation.navigate('RatingsReports')} />
      </View>
    </ScreenContainer>
  );
};
