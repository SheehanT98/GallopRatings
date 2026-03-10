import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ScreenContainer = ({ children, scrollable = true }: ScreenContainerProps) => {
  if (!scrollable) {
    return <SafeAreaView className="flex-1 bg-slate-50 px-4 py-3">{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
