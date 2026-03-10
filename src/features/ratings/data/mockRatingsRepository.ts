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
import type { RatingsRepository } from '@/features/ratings/data/ratingsRepository';
import { filterRatings } from '@/features/ratings/utils/filterRatings';

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const seedLocations: Location[] = [
  { id: 'loc_1', name: 'Ballydoyle' },
  { id: 'loc_2', name: 'Juddmonte' },
  { id: 'loc_3', name: 'Godolphin' },
];

const seedHorses: Horse[] = [
  {
    id: 'horse_1',
    name: 'Silver Banner',
    sire: 'Frankel',
    dam: 'Autumn Lace',
    owners: 'Stable Alpha',
    locationId: 'loc_1',
    locationName: 'Ballydoyle',
    yob: 2023,
    cohort: 'Yearling',
  },
  {
    id: 'horse_2',
    name: 'Dawn Crest',
    sire: 'Dubawi',
    dam: 'High Tide',
    owners: 'Stable Horizon',
    locationId: 'loc_2',
    locationName: 'Juddmonte',
    yob: 2024,
    cohort: 'Foal',
  },
  {
    id: 'horse_3',
    name: 'Storm Pledge',
    sire: 'Justify',
    dam: 'Northern Grace',
    owners: 'Stable Meridian',
    locationId: 'loc_3',
    locationName: 'Godolphin',
    yob: 2023,
    cohort: 'Yearling',
  },
];

const seedRatings: RatingInput[] = [
  {
    id: 'rating_1',
    horseId: 'horse_1',
    horseName: 'Silver Banner',
    authorName: 'MV',
    rating: '7++',
    note: 'Strong mover and balanced temperament.',
    noteDate: '2026-03-05T09:00:00.000Z',
    isStallionRecommended: true,
    stallionRecommendation: 'Wootton Bassett',
  },
  {
    id: 'rating_2',
    horseId: 'horse_2',
    horseName: 'Dawn Crest',
    authorName: 'Paul',
    rating: '7+',
    note: 'Light frame but progressive stride mechanics.',
    noteDate: '2026-03-06T10:30:00.000Z',
    isStallionRecommended: false,
  },
];

class InMemoryRatingsRepository implements RatingsRepository {
  private readonly locations = [...seedLocations];
  private readonly horses = [...seedHorses];
  private ratings = [...seedRatings];
  private staged: StagedReportItem[] = [];

  async getLocations(): Promise<Location[]> {
    return [...this.locations];
  }

  async getHorses(params?: HorseQueryParams): Promise<Horse[]> {
    let rows = [...this.horses];
    if (params?.cohort) {
      rows = rows.filter((row) => row.cohort === params.cohort);
    }
    if (params?.locationId) {
      rows = rows.filter((row) => row.locationId === params.locationId);
    }
    if (params?.search?.trim()) {
      const query = params.search.trim().toLowerCase();
      rows = rows.filter((row) => row.name.toLowerCase().includes(query));
    }
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getHorseById(horseId: string): Promise<Horse | null> {
    return this.horses.find((row) => row.id === horseId) ?? null;
  }

  async getRatingsForHorse(horseId: string): Promise<RatingInput[]> {
    return this.ratings
      .filter((row) => row.horseId === horseId)
      .sort((a, b) => (a.noteDate < b.noteDate ? 1 : -1));
  }

  async getRatings(filters?: RatingFilters): Promise<RatingInput[]> {
    const rows = filterRatings(this.ratings, filters);
    return rows.sort((a, b) => (a.noteDate < b.noteDate ? 1 : -1));
  }

  async createRatingInput(payload: CreateRatingInputPayload): Promise<RatingInput> {
    const horse = this.horses.find((row) => row.id === payload.horseId);
    if (!horse) {
      throw new Error('Horse not found');
    }

    const next: RatingInput = {
      id: id('rating'),
      horseId: horse.id,
      horseName: horse.name,
      authorName: payload.authorName,
      rating: payload.rating,
      note: payload.note.trim(),
      noteDate: now(),
      isStallionRecommended: Boolean(payload.stallionRecommendation?.trim()),
      stallionRecommendation: payload.stallionRecommendation?.trim() || undefined,
    };
    this.ratings = [next, ...this.ratings];
    return next;
  }

  async updateRatingInput(
    ratingId: string,
    payload: UpdateRatingInputPayload,
  ): Promise<RatingInput> {
    const existing = this.ratings.find((row) => row.id === ratingId);
    if (!existing) {
      throw new Error('Rating not found');
    }
    const updated: RatingInput = {
      ...existing,
      authorName: payload.authorName,
      rating: payload.rating,
      note: payload.note.trim(),
      isStallionRecommended: Boolean(payload.stallionRecommendation?.trim()),
      stallionRecommendation: payload.stallionRecommendation?.trim() || undefined,
    };
    this.ratings = this.ratings.map((row) => (row.id === ratingId ? updated : row));
    return updated;
  }

  async stageReportItemFromRating(ratingId: string): Promise<StagedReportItem> {
    const source = this.ratings.find((row) => row.id === ratingId);
    if (!source) {
      throw new Error('Rating not found');
    }
    const duplicate = this.staged.find((row) => row.sourceRatingId === ratingId);
    if (duplicate) {
      return duplicate;
    }
    const staged: StagedReportItem = {
      id: id('staged'),
      sourceRatingId: source.id,
      horseName: source.horseName,
      authorName: source.authorName,
      rating: source.rating,
      note: source.note,
      noteDate: source.noteDate,
      stallionRecommendation: source.stallionRecommendation,
    };
    this.staged = [staged, ...this.staged];
    return staged;
  }

  async getStagedReportItems(): Promise<StagedReportItem[]> {
    return [...this.staged];
  }

  async removeStagedReportItem(stagedId: string): Promise<void> {
    this.staged = this.staged.filter((row) => row.id !== stagedId);
  }

  async clearStagedReportItems(): Promise<void> {
    this.staged = [];
  }
}

export const createMockRatingsRepository = (): RatingsRepository => new InMemoryRatingsRepository();
