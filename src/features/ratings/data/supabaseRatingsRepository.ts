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
import { getSupabaseClient } from '@/lib/supabase/client';

type Row = Record<string, unknown>;

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const mapHorse = (row: Row): Horse => ({
  id: asString(row.id),
  name: asString(row.name, 'Unnamed Horse'),
  sire: asString(row.sire, '-'),
  dam: asString(row.dam, '-'),
  owners: asString(row.owners, '-'),
  locationId: asString(row.location_id),
  locationName: asString(row.location_name, '-'),
  yob: Number(row.yob ?? 0),
  cohort: (row.cohort === 'Foal' ? 'Foal' : 'Yearling'),
});

const mapRating = (row: Row): RatingInput => ({
  id: asString(row.id),
  horseId: asString(row.horse_id),
  horseName: asString(row.horse_name, 'Unknown Horse'),
  authorName: (asString(row.author_name, 'MV') as RatingInput['authorName']),
  rating: (asString(row.rating, '7+') as RatingInput['rating']),
  note: asString(row.note),
  noteDate: asString(row.note_date, new Date().toISOString()),
  isStallionRecommended: Boolean(row.is_stallion_reccommended),
  stallionRecommendation: asString(row.stallion_reccommendation) || undefined,
});

const mapStaged = (row: Row): StagedReportItem => ({
  id: asString(row.id),
  sourceRatingId: asString(row.source_rating_id, asString(row.id)),
  horseName: asString(row.horse_name, 'Unknown Horse'),
  authorName: (asString(row.author_name, 'MV') as StagedReportItem['authorName']),
  rating: (asString(row.rating, '7+') as StagedReportItem['rating']),
  note: asString(row.note),
  noteDate: asString(row.note_date, new Date().toISOString()),
  stallionRecommendation: asString(row.stallion_reccommendation) || undefined,
});

export class SupabaseRatingsRepository implements RatingsRepository {
  private readonly client = getSupabaseClient();

  private assertClient() {
    if (!this.client) {
      throw new Error('Supabase client is not configured');
    }
    return this.client;
  }

  async getLocations(): Promise<Location[]> {
    const client = this.assertClient();
    const { data, error } = await client.from('locations').select('*').order('name');
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: asString((row as Row).id),
      name: asString((row as Row).name),
    }));
  }

  async getHorses(params?: HorseQueryParams): Promise<Horse[]> {
    const client = this.assertClient();
    let query = client.from('horses').select('*').order('name');
    if (params?.cohort) {
      query = query.eq('cohort', params.cohort);
    }
    if (params?.locationId) {
      query = query.eq('location_id', params.locationId);
    }
    if (params?.search) {
      query = query.ilike('name', `%${params.search.trim()}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => mapHorse(row as Row));
  }

  async getHorseById(horseId: string): Promise<Horse | null> {
    const client = this.assertClient();
    const { data, error } = await client.from('horses').select('*').eq('id', horseId).maybeSingle();
    if (error) throw error;
    return data ? mapHorse(data as Row) : null;
  }

  async getRatingsForHorse(horseId: string): Promise<RatingInput[]> {
    const client = this.assertClient();
    const { data, error } = await client
      .from('ratings_inputs')
      .select('*')
      .eq('horse_id', horseId)
      .order('note_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapRating(row as Row));
  }

  async getRatings(filters?: RatingFilters): Promise<RatingInput[]> {
    const client = this.assertClient();
    const { data, error } = await client
      .from('ratings_inputs')
      .select('*')
      .order('note_date', { ascending: false });
    if (error) throw error;
    const rows = (data ?? []).map((row) => mapRating(row as Row));
    return filterRatings(rows, filters);
  }

  async createRatingInput(payload: CreateRatingInputPayload): Promise<RatingInput> {
    const client = this.assertClient();
    const horse = await this.getHorseById(payload.horseId);
    if (!horse) {
      throw new Error('Horse not found');
    }
    const { data, error } = await client
      .from('ratings_inputs')
      .insert({
        horse_id: payload.horseId,
        horse_name: horse.name,
        author_name: payload.authorName,
        rating: payload.rating,
        note: payload.note,
        note_date: new Date().toISOString(),
        is_stallion_reccommended: Boolean(payload.stallionRecommendation),
        stallion_reccommendation: payload.stallionRecommendation ?? null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapRating(data as Row);
  }

  async updateRatingInput(ratingId: string, payload: UpdateRatingInputPayload): Promise<RatingInput> {
    const client = this.assertClient();
    const { data, error } = await client
      .from('ratings_inputs')
      .update({
        author_name: payload.authorName,
        rating: payload.rating,
        note: payload.note,
        is_stallion_reccommended: Boolean(payload.stallionRecommendation),
        stallion_reccommendation: payload.stallionRecommendation ?? null,
      })
      .eq('id', ratingId)
      .select('*')
      .single();
    if (error) throw error;
    return mapRating(data as Row);
  }

  async stageReportItemFromRating(ratingId: string): Promise<StagedReportItem> {
    const client = this.assertClient();
    const { data: rating, error: ratingError } = await client
      .from('ratings_inputs')
      .select('*')
      .eq('id', ratingId)
      .single();
    if (ratingError) throw ratingError;

    const { data, error } = await client
      .from('ratings_inputs_temporary')
      .insert({
        source_rating_id: asString((rating as Row).id),
        horse_name: asString((rating as Row).horse_name),
        author_name: asString((rating as Row).author_name),
        rating: asString((rating as Row).rating),
        note: asString((rating as Row).note),
        note_date: asString((rating as Row).note_date),
        stallion_reccommendation: asString((rating as Row).stallion_reccommendation) || null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapStaged(data as Row);
  }

  async getStagedReportItems(): Promise<StagedReportItem[]> {
    const client = this.assertClient();
    const { data, error } = await client
      .from('ratings_inputs_temporary')
      .select('*')
      .order('note_date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapStaged(row as Row));
  }

  async removeStagedReportItem(stagedId: string): Promise<void> {
    const client = this.assertClient();
    const { error } = await client.from('ratings_inputs_temporary').delete().eq('id', stagedId);
    if (error) throw error;
  }

  async clearStagedReportItems(): Promise<void> {
    const client = this.assertClient();
    const { error } = await client.from('ratings_inputs_temporary').delete().not('id', 'is', null);
    if (error) throw error;
  }
}
