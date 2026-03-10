import React from 'react';
import { Text, View } from 'react-native';

import { SectionCard } from '@/components/ui/SectionCard';
import type { Horse } from '@/features/ratings/types/domain';

interface HorseSummaryCardProps {
  horse: Horse;
}

export const HorseSummaryCard = ({ horse }: HorseSummaryCardProps) => {
  return (
    <SectionCard>
      <Text className="text-xl font-semibold text-slate-900">{horse.name}</Text>
      <Text className="mt-1 text-slate-600">
        {horse.sire} x {horse.dam}
      </Text>
      <View className="mt-3 gap-1">
        <Text className="text-slate-700">Owners: {horse.owners}</Text>
        <Text className="text-slate-700">Location: {horse.locationName}</Text>
        <Text className="text-slate-700">
          YOB: {horse.yob} · {horse.cohort}
        </Text>
      </View>
    </SectionCard>
  );
};
