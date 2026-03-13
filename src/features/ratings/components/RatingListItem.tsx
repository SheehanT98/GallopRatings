import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/SectionCard';
import type { RatingInput } from '@/features/ratings/types/domain';

interface RatingListItemProps {
  item: RatingInput;
  onPress?: (item: RatingInput) => void;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

export const RatingListItem = React.memo(({ item, onPress }: RatingListItemProps) => {
  return (
    <Pressable disabled={!onPress} onPress={() => onPress?.(item)}>
      <SectionCard>
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-base font-semibold" style={{ color: '#3A4E66' }}>
              {item.horseName}
            </Text>
            <Text className="text-sm text-slate-500">
              {item.authorName} · {formatDate(item.noteDate)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-700">
              {item.rating}
            </Text>
            {onPress ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#94a3b8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="edit" size={24} color="#3a55f6" />
              </View>
            ) : null}
          </View>
        </View>
        <Text className="mt-2 text-slate-700">{item.note || '-'}</Text>
        {item.stallionRecommendation ? (
          <Text className="mt-2 text-sm text-slate-500">Stallion: {item.stallionRecommendation}</Text>
        ) : null}
      </SectionCard>
    </Pressable>
  );
});

RatingListItem.displayName = 'RatingListItem';
