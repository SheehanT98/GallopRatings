import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsHome'>;

export const RatingsHomeScreen = ({ navigation }: Props) => {
  return (
    <ScreenContainer>
      <SectionCard>
        <Text className="text-xl font-semibold text-slate-900">Ratings Workspace</Text>
        <Text className="mt-2 text-slate-600">
          Manage ratings input, barn list preparation, and report generation.
        </Text>
      </SectionCard>

      <View className="gap-3">
        <PrimaryButton label="Ratings Input" onPress={() => navigation.navigate('RatingsInput')} />
        <PrimaryButton label="Generate Barn List" onPress={() => navigation.navigate('RatingsBarnList')} />
        <PrimaryButton label="Report Builder" onPress={() => navigation.navigate('RatingsReports')} />
      </View>
    </ScreenContainer>
  );
};
