import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRatingsRepository } from '@/features/ratings/data/ratingsRepositoryContext';
import type {
  CreateRatingInputPayload,
  HorseQueryParams,
  RatingFilters,
  UpdateRatingInputPayload,
} from '@/features/ratings/types/domain';

const queryKeys = {
  horses: (params?: HorseQueryParams) => ['horses', params] as const,
  horse: (horseId: string) => ['horse', horseId] as const,
  horseRatings: (horseId: string) => ['horseRatings', horseId] as const,
  ratings: (filters?: RatingFilters) => ['ratings', filters] as const,
  locations: ['locations'] as const,
  staged: ['stagedReportItems'] as const,
};

export const useLocationsQuery = () => {
  const repository = useRatingsRepository();
  return useQuery({
    queryKey: queryKeys.locations,
    queryFn: () => repository.getLocations(),
    staleTime: 5 * 60_000,
  });
};

export const useHorsesQuery = (params?: HorseQueryParams) => {
  const repository = useRatingsRepository();
  return useQuery({
    queryKey: queryKeys.horses(params),
    queryFn: () => repository.getHorses(params),
    staleTime: 60_000,
  });
};

export const useHorseQuery = (horseId?: string) => {
  const repository = useRatingsRepository();
  return useQuery({
    enabled: Boolean(horseId),
    queryKey: queryKeys.horse(horseId ?? 'none'),
    queryFn: () => repository.getHorseById(horseId ?? ''),
  });
};

export const useHorseRatingsQuery = (horseId?: string) => {
  const repository = useRatingsRepository();
  return useQuery({
    enabled: Boolean(horseId),
    queryKey: queryKeys.horseRatings(horseId ?? 'none'),
    queryFn: () => repository.getRatingsForHorse(horseId ?? ''),
    staleTime: 30_000,
  });
};

export const useRatingsQuery = (filters?: RatingFilters) => {
  const repository = useRatingsRepository();
  return useQuery({
    queryKey: queryKeys.ratings(filters),
    queryFn: () => repository.getRatings(filters),
    staleTime: 30_000,
  });
};

export const useStagedReportItemsQuery = () => {
  const repository = useRatingsRepository();
  return useQuery({
    queryKey: queryKeys.staged,
    queryFn: () => repository.getStagedReportItems(),
  });
};

export const useCreateRatingMutation = () => {
  const repository = useRatingsRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRatingInputPayload) => repository.createRatingInput(payload),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.horseRatings(row.horseId) });
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
    },
  });
};

export const useUpdateRatingMutation = () => {
  const repository = useRatingsRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ratingId, payload }: { ratingId: string; payload: UpdateRatingInputPayload }) =>
      repository.updateRatingInput(ratingId, payload),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.horseRatings(row.horseId) });
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.staged });
    },
  });
};

export const useStageReportItemMutation = () => {
  const repository = useRatingsRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ratingId: string) => repository.stageReportItemFromRating(ratingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staged });
    },
  });
};

export const useRemoveStagedItemMutation = () => {
  const repository = useRatingsRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stagedId: string) => repository.removeStagedReportItem(stagedId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.staged }),
  });
};

export const useClearStagedItemsMutation = () => {
  const repository = useRatingsRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => repository.clearStagedReportItems(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.staged }),
  });
};
