import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { useResponsiveLayout } from '@/lib/responsive/useResponsiveLayout';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ScreenContainer = ({ children, scrollable = true }: ScreenContainerProps) => {
  const { contentMaxWidth, isDesktop } = useResponsiveLayout();

  if (!scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View
          style={{
            width: '100%',
            maxWidth: contentMaxWidth,
            alignSelf: 'center',
            paddingHorizontal: isDesktop ? 24 : 16,
            paddingVertical: 12,
            gap: 12,
          }}
        >
          {children}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: contentMaxWidth,
            paddingHorizontal: isDesktop ? 24 : 16,
            gap: 12,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
