import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export interface ResponsiveLayout {
  width: number;
  isTablet: boolean;
  isDesktop: boolean;
  contentMaxWidth: number;
}

export const getResponsiveLayout = (width: number): ResponsiveLayout => {
  const isDesktop = width >= 1100;
  const isTablet = width >= 768;
  const contentMaxWidth = isDesktop ? 1280 : isTablet ? 980 : 640;

  return {
    width,
    isTablet,
    isDesktop,
    contentMaxWidth,
  };
};

export const useResponsiveLayout = (): ResponsiveLayout => {
  const { width } = useWindowDimensions();
  return useMemo(() => getResponsiveLayout(width), [width]);
};
