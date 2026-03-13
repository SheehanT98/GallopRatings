import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { StagedReportListItem } from '@/features/ratings/components/StagedReportListItem';
import {
  useClearStagedItemsMutation,
  useStagedReportItemsQuery,
} from '@/features/ratings/hooks/useRatingsQueries';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsReportingPage'>;

export const RatingsReportingPageScreen = ({ navigation }: Props) => {
  const { isDesktop } = useResponsiveLayout();
  const stagedQuery = useStagedReportItemsQuery();
  const clearMutation = useClearStagedItemsMutation();

  return (
    <ScreenContainer>
      <SectionCard>
        <Text className="text-xl font-semibold" style={{ color: '#3A4E66' }}>
          Generated Report
        </Text>
        <Text className="mt-2 text-slate-600">
          Review staged entries before external export or sharing.
        </Text>
      </SectionCard>

      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: isDesktop ? 2 : 1, width: '100%', gap: 12 }}>
          <FlatList
            data={stagedQuery.data ?? []}
            key={isDesktop ? 'desktop-report-grid' : 'mobile-report-list'}
            keyExtractor={(item) => item.id}
            numColumns={isDesktop ? 2 : 1}
            scrollEnabled={false}
            columnWrapperStyle={isDesktop ? { gap: 10 } : undefined}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <StagedReportListItem item={item} />
              </View>
            )}
          />
          {!stagedQuery.data?.length ? (
            <SectionCard>
              <Text className="text-slate-500">No staged report items available.</Text>
            </SectionCard>
          ) : null}
        </View>

        <View style={{ flex: isDesktop ? 1 : 1, width: '100%' }}>
          <SectionCard>
            <View className="gap-2">
              <PrimaryButton
                label="Back To Reports"
                onPress={() => navigation.navigate('RatingsReports')}
              />
              <PrimaryButton
                label={clearMutation.isPending ? 'Clearing...' : 'Clear Report'}
                onPress={() => clearMutation.mutate()}
                disabled={!stagedQuery.data?.length || clearMutation.isPending}
              />
            </View>
          </SectionCard>
        </View>
      </View>
    </ScreenContainer>
  );
};
