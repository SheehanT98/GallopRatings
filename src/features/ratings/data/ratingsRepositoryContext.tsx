import React, { createContext, useContext } from 'react';

import { createDefaultRatingsRepository } from '@/features/ratings/data/createDefaultRatingsRepository';
import type { RatingsRepository } from '@/features/ratings/data/ratingsRepository';

const RatingsRepositoryContext = createContext<RatingsRepository | null>(null);

interface RatingsRepositoryProviderProps {
  children: React.ReactNode;
  repository?: RatingsRepository;
}

export const RatingsRepositoryProvider = ({
  children,
  repository,
}: RatingsRepositoryProviderProps) => {
  const repositoryRef = React.useRef<RatingsRepository | null>(null);
  if (!repositoryRef.current) {
    repositoryRef.current = repository ?? createDefaultRatingsRepository();
  }
  const value = repositoryRef.current;

  return (
    <RatingsRepositoryContext.Provider value={value}>{children}</RatingsRepositoryContext.Provider>
  );
};

export const useRatingsRepository = (): RatingsRepository => {
  const context = useContext(RatingsRepositoryContext);
  if (!context) {
    throw new Error('useRatingsRepository must be used within RatingsRepositoryProvider');
  }
  return context;
};
