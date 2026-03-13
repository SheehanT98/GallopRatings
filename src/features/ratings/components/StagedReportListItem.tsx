import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionCard } from '@/components/ui/SectionCard';
import type { StagedReportItem } from '@/features/ratings/types/domain';

interface StagedReportListItemProps {
  item: StagedReportItem;
  onRemove?: (id: string) => void;
}

export const StagedReportListItem = ({ item, onRemove }: StagedReportListItemProps) => {
  return (
    <SectionCard>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold" style={{ color: '#3A4E66' }}>
          {item.horseName}
        </Text>
        <Text className="text-sm font-semibold text-brand-700">{item.rating}</Text>
      </View>
      <Text className="mt-1 text-sm text-slate-500">{item.authorName}</Text>
      <Text className="mt-2 text-slate-700">{item.note || '-'}</Text>
      {onRemove ? (
        <View className="mt-3">
          <PrimaryButton label="Remove" onPress={() => onRemove(item.id)} />
        </View>
      ) : null}
    </SectionCard>
  );
};
