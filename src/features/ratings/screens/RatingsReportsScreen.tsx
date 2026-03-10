import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { Field } from '@/components/ui/Field';
import { OptionChips } from '@/components/ui/OptionChips';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { AUTHOR_OPTIONS, RATING_OPTIONS } from '@/features/ratings/constants/options';
import { RatingListItem } from '@/features/ratings/components/RatingListItem';
import { StagedReportListItem } from '@/features/ratings/components/StagedReportListItem';
import {
  useClearStagedItemsMutation,
  useRatingsQuery,
  useRemoveStagedItemMutation,
  useStageReportItemMutation,
  useStagedReportItemsQuery,
} from '@/features/ratings/hooks/useRatingsQueries';
import type { AuthorName, RatingValue } from '@/features/ratings/types/domain';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsReports'>;

export const RatingsReportsScreen = ({ navigation }: Props) => {
  const [horseName, setHorseName] = React.useState('');
  const [authorName, setAuthorName] = React.useState<AuthorName | undefined>();
  const [rating, setRating] = React.useState<RatingValue | undefined>();

  const filters = React.useMemo(
    () => ({
      horseName: horseName.trim() || undefined,
      authorName,
      rating,
    }),
    [authorName, horseName, rating],
  );

  const ratingsQuery = useRatingsQuery(filters);
  const stagedQuery = useStagedReportItemsQuery();
  const stageMutation = useStageReportItemMutation();
  const removeMutation = useRemoveStagedItemMutation();
  const clearMutation = useClearStagedItemsMutation();

  return (
    <ScreenContainer>
      <SectionCard>
        <Text className="mb-2 text-lg font-semibold text-slate-900">Filters</Text>
        <Field
          label="Horse name"
          value={horseName}
          onChangeText={setHorseName}
          placeholder="Search by horse name..."
        />
        <View className="mt-3">
          <OptionChips
            label="Author"
            options={AUTHOR_OPTIONS}
            selected={authorName}
            onSelect={(next) => setAuthorName((prev) => (prev === next ? undefined : next))}
          />
        </View>
        <View className="mt-3">
          <OptionChips
            label="Rating"
            options={RATING_OPTIONS}
            selected={rating}
            onSelect={(next) => setRating((prev) => (prev === next ? undefined : next))}
          />
        </View>
      </SectionCard>

      <SectionCard>
        <Text className="mb-2 text-lg font-semibold text-slate-900">Ratings Results</Text>
        <FlatList
          data={ratingsQuery.data ?? []}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <View className="gap-2">
              <RatingListItem item={item} />
              <PrimaryButton
                label="Add To Report"
                onPress={() => stageMutation.mutate(item.id)}
                disabled={stageMutation.isPending}
              />
            </View>
          )}
          ListEmptyComponent={<Text className="text-slate-500">No ratings match selected filters.</Text>}
        />
      </SectionCard>

      <SectionCard>
        <Text className="mb-2 text-lg font-semibold text-slate-900">Staged Report Items</Text>
        <View className="gap-3">
          {(stagedQuery.data ?? []).map((item) => (
            <StagedReportListItem
              key={item.id}
              item={item}
              onRemove={(stagedId) => removeMutation.mutate(stagedId)}
            />
          ))}
          {!stagedQuery.data?.length ? (
            <Text className="text-slate-500">No staged report items yet.</Text>
          ) : null}
        </View>
        <View className="mt-3 gap-2">
          <PrimaryButton
            label="Build Report"
            onPress={() => navigation.navigate('RatingsReportingPage')}
            disabled={!stagedQuery.data?.length}
          />
          <PrimaryButton
            label="Clear Staged Items"
            onPress={() => clearMutation.mutate()}
            disabled={!stagedQuery.data?.length || clearMutation.isPending}
          />
        </View>
      </SectionCard>
    </ScreenContainer>
  );
};
