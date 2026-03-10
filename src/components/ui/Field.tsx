import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const Field = ({ label, value, onChangeText, placeholder, multiline }: FieldProps) => {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        className={`rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 ${
          multiline ? 'min-h-[96px]' : ''
        }`}
      />
    </View>
  );
};
