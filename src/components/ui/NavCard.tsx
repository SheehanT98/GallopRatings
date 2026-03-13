import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

interface NavCardProps {
  title: string;
  onPress: () => void;
}

export const NavCard = ({ title, onPress }: NavCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 70,
          borderRadius: 12,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          opacity: pressed ? 0.9 : 1,
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
        },
      ]}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#3A4E66' }}>{title}</Text>
      <MaterialIcons name="arrow-forward-ios" size={20} color="#3A4E66" />
    </Pressable>
  );
};
