import React from 'react';
import { Platform, View } from 'react-native';

interface SectionCardProps {
  children: React.ReactNode;
}

export const SectionCard = ({ children }: SectionCardProps) => {
  return (
    <View
      className="bg-white p-4"
      style={{
        borderRadius: 12,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          android: { elevation: 2 },
          web: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        }),
      }}
    >
      {children}
    </View>
  );
};
