import React from 'react';
import { View } from 'react-native';

interface SectionCardProps {
  children: React.ReactNode;
}

export const SectionCard = ({ children }: SectionCardProps) => {
  return <View className="rounded-2xl border border-slate-200 bg-white p-4">{children}</View>;
};
