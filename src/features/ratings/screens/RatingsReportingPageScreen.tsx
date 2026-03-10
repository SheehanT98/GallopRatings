import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { StagedReportListItem } from '@/features/ratings/components/StagedReportListItem';
import {
  useClearStagedItemsMutation,
  useStagedReportItemsQuery,
} from '@/features/ratings/hooks/useRatingsQueries';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsReportingPage'>;

export const RatingsReportingPageScreen = ({ navigation }: Props) => {
  const stagedQuery = useStagedReportItemsQuery();
  const clearMutation = useClearStagedItemsMutation();

  return (
    <ScreenContainer>
      <SectionCard>
        <Text className="text-xl font-semibold text-slate-900">Generated Report</Text>
        <Text className="mt-2 text-slate-600">
          Review staged entries before external export or sharing.
        </Text>
      </SectionCard>

      <View className="gap-3">
        {(stagedQuery.data ?? []).map((item) => (
          <StagedReportListItem key={item.id} item={item} />
        ))}
        {!stagedQuery.data?.length ? (
          <SectionCard>
            <Text className="text-slate-500">No staged report items available.</Text>
          </SectionCard>
        ) : null}
      </View>

      <SectionCard>
        <View className="gap-2">
          <PrimaryButton label="Back To Reports" onPress={() => navigation.navigate('RatingsReports')} />
          <PrimaryButton
            label={clearMutation.isPending ? 'Clearing...' : 'Clear Report'}
            onPress={() => clearMutation.mutate()}
            disabled={!stagedQuery.data?.length || clearMutation.isPending}
          />
        </View>
      </SectionCard>
    </ScreenContainer>
  );
};
