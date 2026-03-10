import type {
  CreateRatingInputPayload,
  Horse,
  HorseQueryParams,
  Location,
  RatingFilters,
  RatingInput,
  StagedReportItem,
  UpdateRatingInputPayload,
} from '@/features/ratings/types/domain';

export interface RatingsRepository {
  getLocations(): Promise<Location[]>;
  getHorses(params?: HorseQueryParams): Promise<Horse[]>;
  getHorseById(horseId: string): Promise<Horse | null>;
  getRatingsForHorse(horseId: string): Promise<RatingInput[]>;
  getRatings(filters?: RatingFilters): Promise<RatingInput[]>;
  createRatingInput(payload: CreateRatingInputPayload): Promise<RatingInput>;
  updateRatingInput(ratingId: string, payload: UpdateRatingInputPayload): Promise<RatingInput>;
  stageReportItemFromRating(ratingId: string): Promise<StagedReportItem>;
  getStagedReportItems(): Promise<StagedReportItem[]>;
  removeStagedReportItem(stagedId: string): Promise<void>;
  clearStagedReportItems(): Promise<void>;
}
