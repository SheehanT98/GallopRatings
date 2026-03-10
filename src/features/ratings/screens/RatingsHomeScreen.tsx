import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsHome'>;

export const RatingsHomeScreen = ({ navigation }: Props) => {
  const { isDesktop } = useResponsiveLayout();

  return (
    <ScreenContainer>
      <SectionCard>
        <Text className="text-xl font-semibold text-slate-900">Ratings Workspace</Text>
        <Text className="mt-2 text-slate-600">
          Manage ratings input, barn list preparation, and report generation.
        </Text>
      </SectionCard>

      <View
        style={{
          flexDirection: isDesktop ? 'row' : 'column',
          flexWrap: isDesktop ? 'wrap' : 'nowrap',
          gap: 12,
        }}
      >
        <View style={{ flex: 1, minWidth: isDesktop ? 260 : undefined }}>
          <PrimaryButton label="Ratings Input" onPress={() => navigation.navigate('RatingsInput')} />
        </View>
        <View style={{ flex: 1, minWidth: isDesktop ? 260 : undefined }}>
          <PrimaryButton
            label="Generate Barn List"
            onPress={() => navigation.navigate('RatingsBarnList')}
          />
        </View>
        <View style={{ flex: 1, minWidth: isDesktop ? 260 : undefined }}>
          <PrimaryButton label="Report Builder" onPress={() => navigation.navigate('RatingsReports')} />
        </View>
      </View>
    </ScreenContainer>
  );
};
