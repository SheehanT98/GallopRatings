import React from 'react';
import { Pressable, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export const PrimaryButton = ({ label, onPress, disabled, testID }: PrimaryButtonProps) => {
  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      className={`rounded-xl px-4 py-3 ${
        disabled ? 'bg-slate-300' : 'bg-brand-600 active:bg-brand-700'
      }`}
    >
      <Text className="text-center font-semibold text-white">{label}</Text>
    </Pressable>
  );
};
