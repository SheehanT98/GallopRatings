import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Platform, Pressable, Text, View } from 'react-native';

import type { RootStackParamList } from '@/app/navigation/types';
import { Field } from '@/components/ui/Field';
import { OptionChips } from '@/components/ui/OptionChips';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionCard } from '@/components/ui/SectionCard';
import { COHORT_OPTIONS } from '@/features/ratings/constants/options';
import { useHorsesQuery, useLocationsQuery } from '@/features/ratings/hooks/useRatingsQueries';
import type { Cohort } from '@/features/ratings/types/domain';
import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

type Props = NativeStackScreenProps<RootStackParamList, 'RatingsBarnList'>;

export const RatingsBarnListScreen = ({ navigation }: Props) => {
  const { isDesktop } = useResponsiveLayout();
  const [cohort, setCohort] = React.useState<Cohort>('Yearling');
  const [locationId, setLocationId] = React.useState<string | undefined>();
  const [search, setSearch] = React.useState('');

  const locationsQuery = useLocationsQuery();
  const horsesQuery = useHorsesQuery({ cohort, locationId, search });

  return (
    <ScreenContainer>
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: isDesktop ? 0.9 : 1, width: '100%' }}>
          <SectionCard>
            <Text className="mb-2 text-lg font-semibold" style={{ color: '#3A4E66' }}>
              Barn List Filters
            </Text>
            <OptionChips label="Cohort" options={COHORT_OPTIONS} selected={cohort} onSelect={setCohort} />
            <View className="mt-3">
              <Text className="mb-2 text-sm font-medium text-slate-700">Location</Text>
              <View className="flex-row flex-wrap gap-2">
                {(locationsQuery.data ?? []).map((location) => {
                  const isSelected = location.id === locationId;
                  return (
                    <Pressable
                      key={location.id}
                      onPress={() =>
                        setLocationId((prev) => (prev === location.id ? undefined : location.id))
                      }
                      className={`rounded-full px-3 py-2 ${
                        isSelected ? 'bg-brand-600' : 'bg-slate-200'
                      }`}
                    >
                      <Text className={isSelected ? 'text-white' : 'text-slate-700'}>
                        {location.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View className="mt-3">
              <Field
                label="Horse search"
                value={search}
                onChangeText={setSearch}
                placeholder="Search horse..."
              />
            </View>
          </SectionCard>
        </View>

        <View style={{ flex: 2, width: '100%' }}>
          <SectionCard>
            <Text className="mb-2 text-lg font-semibold" style={{ color: '#3A4E66' }}>
              Barn Horses
            </Text>
            <FlatList
              data={horsesQuery.data ?? []}
              key={isDesktop ? 'desktop-grid' : 'mobile-list'}
              keyExtractor={(item) => item.id}
              numColumns={isDesktop ? 2 : 1}
              scrollEnabled={false}
              columnWrapperStyle={isDesktop ? { gap: 8 } : undefined}
              ItemSeparatorComponent={() => <View className="h-2" />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate('RatingsInput', { horseId: item.id })}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 12,
                      backgroundColor: 'white',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      opacity: pressed ? 0.9 : 1,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        },
                        android: { elevation: 2 },
                        web: { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
                      }),
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#3a55f6' }}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#3A506B', marginTop: 2 }}>
                      {item.sire} x {item.dam}
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward-ios" size={20} color="#3a55f6" />
                </Pressable>
              )}
              ListEmptyComponent={<Text className="text-slate-500">No horses for selected filters.</Text>}
            />
          </SectionCard>
        </View>
      </View>
    </ScreenContainer>
  );
};
