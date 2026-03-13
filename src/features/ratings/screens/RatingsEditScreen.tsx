import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { Field } from '@/components/ui/Field';
import { OptionChips } from '@/components/ui/OptionChips';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  AUTHOR_OPTIONS,
  RATING_OPTIONS,
  STALLION_OPTIONS,
} from '@/features/ratings/constants/options';
import { HorseSummaryCard } from '@/features/ratings/components/HorseSummaryCard';
import { RatingListItem } from '@/features/ratings/components/RatingListItem';
import {
  useHorseQuery,
  useHorseRatingsQuery,
  useUpdateRatingMutation,
} from '@/features/ratings/hooks/useRatingsQueries';
import type { AuthorName, RatingValue } from '@/features/ratings/types/domain';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsEdit'>;

export const RatingsEditScreen = ({ route }: Props) => {
  const { isDesktop } = useResponsiveLayout();
  const { horseId, ratingId } = route.params;
  const [authorName, setAuthorName] = React.useState<AuthorName>('MV');
  const [rating, setRating] = React.useState<RatingValue>('7+');
  const [stallionRecommendation, setStallionRecommendation] = React.useState<
    (typeof STALLION_OPTIONS)[number] | ''
  >('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const horseQuery = useHorseQuery(horseId);
  const ratingsQuery = useHorseRatingsQuery(horseId);
  const updateMutation = useUpdateRatingMutation();

  const selectedRating = React.useMemo(
    () => (ratingsQuery.data ?? []).find((row) => row.id === ratingId),
    [ratingId, ratingsQuery.data],
  );

  React.useEffect(() => {
    if (!selectedRating) {
      return;
    }
    setAuthorName(selectedRating.authorName);
    setRating(selectedRating.rating);
    const nextStallion = STALLION_OPTIONS.find(
      (option) => option === selectedRating.stallionRecommendation,
    );
    setStallionRecommendation(nextStallion ?? '');
    setNote(selectedRating.note);
  }, [selectedRating]);

  const onSave = async () => {
    if (!note.trim()) {
      setError('Note is required.');
      return;
    }
    setError(null);
    await updateMutation.mutateAsync({
      ratingId,
      payload: {
        authorName,
        rating,
        note,
        stallionRecommendation: stallionRecommendation || undefined,
      },
    });
  };

  if (!selectedRating) {
    return (
      <ScreenContainer>
        <SectionCard>
          <Text className="text-base text-slate-700">
            Rating record was not found. It may have been deleted.
          </Text>
        </SectionCard>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, width: '100%' }}>
          {horseQuery.data ? <HorseSummaryCard horse={horseQuery.data} /> : null}
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          <SectionCard>
            <Text className="mb-2 text-lg font-semibold" style={{ color: '#3A4E66' }}>
              Edit Rating
            </Text>
            <OptionChips label="Rating" options={RATING_OPTIONS} selected={rating} onSelect={setRating} />
            <View className="mt-3">
              <OptionChips
                label="Author"
                options={AUTHOR_OPTIONS}
                selected={authorName}
                onSelect={setAuthorName}
              />
            </View>
            <View className="mt-3">
              <OptionChips
                label="Stallion Recommendation"
                options={STALLION_OPTIONS}
                selected={stallionRecommendation || undefined}
                onSelect={setStallionRecommendation}
              />
            </View>
            <View className="mt-3">
              <Field
                label="Note"
                value={note}
                onChangeText={setNote}
                placeholder="Update note..."
                multiline
              />
            </View>
            {error ? <Text className="mt-2 text-sm text-red-600">{error}</Text> : null}
            <View className="mt-3">
              <PrimaryButton
                label={updateMutation.isPending ? 'Updating...' : 'Update Rating'}
                onPress={onSave}
                disabled={updateMutation.isPending}
              />
            </View>
          </SectionCard>
        </View>
      </View>

      <SectionCard>
        <Text className="mb-2 text-lg font-semibold" style={{ color: '#3A4E66' }}>
          Horse History
        </Text>
        <FlatList
          data={ratingsQuery.data ?? []}
          key={isDesktop ? 'desktop-history-grid' : 'mobile-history-list'}
          keyExtractor={(item) => item.id}
          numColumns={isDesktop ? 2 : 1}
          scrollEnabled={false}
          columnWrapperStyle={isDesktop ? { gap: 10 } : undefined}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <RatingListItem item={item} />
            </View>
          )}
        />
      </SectionCard>
    </ScreenContainer>
  );
};
