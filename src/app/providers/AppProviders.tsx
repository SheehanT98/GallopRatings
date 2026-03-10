import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { RatingsRepositoryProvider } from '@/features/ratings/data/ratingsRepositoryContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RatingsRepositoryProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </RatingsRepositoryProvider>
    </QueryClientProvider>
  );
};
