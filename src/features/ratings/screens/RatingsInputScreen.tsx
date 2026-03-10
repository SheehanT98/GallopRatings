import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

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
  useCreateRatingMutation,
  useHorseQuery,
  useHorseRatingsQuery,
  useHorsesQuery,
} from '@/features/ratings/hooks/useRatingsQueries';
import type { AuthorName, RatingValue } from '@/features/ratings/types/domain';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsInput'>;

export const RatingsInputScreen = ({ navigation, route }: Props) => {
  const { isDesktop } = useResponsiveLayout();
  const [horseSearch, setHorseSearch] = React.useState('');
  const [selectedHorseId, setSelectedHorseId] = React.useState<string | undefined>(route.params?.horseId);
  const [authorName, setAuthorName] = React.useState<AuthorName>('MV');
  const [rating, setRating] = React.useState<RatingValue>('7+');
  const [stallionRecommendation, setStallionRecommendation] = React.useState<
    (typeof STALLION_OPTIONS)[number] | ''
  >('');
  const [note, setNote] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const horsesQuery = useHorsesQuery({ search: horseSearch });
  const horseQuery = useHorseQuery(selectedHorseId);
  const ratingsQuery = useHorseRatingsQuery(selectedHorseId);
  const createMutation = useCreateRatingMutation();

  const onSubmit = async () => {
    if (!selectedHorseId) {
      setError('Please select a horse.');
      return;
    }
    if (!note.trim()) {
      setError('Please add a note.');
      return;
    }
    setError(null);
    await createMutation.mutateAsync({
      horseId: selectedHorseId,
      authorName,
      rating,
      note,
      stallionRecommendation: stallionRecommendation || undefined,
    });
    setNote('');
    setStallionRecommendation('');
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1, width: '100%', gap: 12 }}>
          <SectionCard>
            <Text className="mb-2 text-lg font-semibold text-slate-900">Horse Selection</Text>
            <Field
              label="Search horse"
              value={horseSearch}
              onChangeText={setHorseSearch}
              placeholder="Type horse name..."
            />
            <FlatList
              data={horsesQuery.data ?? []}
              horizontal
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 8, marginTop: 12 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedHorseId(item.id)}
                  className={`rounded-full px-3 py-2 ${
                    selectedHorseId === item.id ? 'bg-brand-600' : 'bg-slate-200'
                  }`}
                >
                  <Text className={selectedHorseId === item.id ? 'text-white' : 'text-slate-700'}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          </SectionCard>

          {horseQuery.data ? <HorseSummaryCard horse={horseQuery.data} /> : null}
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          <SectionCard>
            <Text className="mb-2 text-lg font-semibold text-slate-900">New Rating</Text>
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
                placeholder="Add note..."
                multiline
              />
            </View>
            {error ? <Text className="mt-2 text-sm text-red-600">{error}</Text> : null}
            <View className="mt-3">
              <PrimaryButton
                label={createMutation.isPending ? 'Saving...' : 'Save Rating'}
                disabled={createMutation.isPending}
                onPress={onSubmit}
              />
            </View>
          </SectionCard>
        </View>
      </View>

      <SectionCard>
        <Text className="mb-2 text-lg font-semibold text-slate-900">Rating History</Text>
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
              <RatingListItem
                item={item}
                onPress={() =>
                  navigation.navigate('RatingsEdit', {
                    horseId: item.horseId,
                    ratingId: item.id,
                  })
                }
              />
            </View>
          )}
          ListEmptyComponent={<Text className="text-slate-500">No ratings yet for selected horse.</Text>}
        />
      </SectionCard>
    </ScreenContainer>
  );
};
