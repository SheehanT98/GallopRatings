import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface OptionChipsProps<T extends string> {
  label: string;
  options: readonly T[];
  selected?: T;
  onSelect: (value: T) => void;
}

export const OptionChips = <T extends string>({
  label,
  options,
  selected,
  onSelect,
}: OptionChipsProps<T>) => {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className={`rounded-full px-3 py-2 ${
                isSelected ? 'bg-brand-600' : 'bg-slate-200'
              }`}
            >
              <Text className={isSelected ? 'text-white' : 'text-slate-700'}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
