export type Cohort = 'Yearling' | 'Foal';
export type RatingValue = '7+' | '7++' | '7+++';
export type AuthorName = 'MV' | 'Paul' | 'Aidan';

export interface Location {
  id: string;
  name: string;
}

export interface Horse {
  id: string;
  name: string;
  sire: string;
  dam: string;
  owners: string;
  locationId: string;
  locationName: string;
  yob: number;
  cohort: Cohort;
}

export interface RatingInput {
  id: string;
  horseId: string;
  horseName: string;
  authorName: AuthorName;
  rating: RatingValue;
  note: string;
  noteDate: string;
  isStallionRecommended: boolean;
  stallionRecommendation?: string;
}

export interface StagedReportItem {
  id: string;
  sourceRatingId: string;
  horseName: string;
  authorName: AuthorName;
  rating: RatingValue;
  note: string;
  noteDate: string;
  stallionRecommendation?: string;
}

export interface RatingFilters {
  horseName?: string;
  authorName?: AuthorName;
  rating?: RatingValue;
  fromDate?: string;
  toDate?: string;
}

export interface HorseQueryParams {
  cohort?: Cohort;
  locationId?: string;
  search?: string;
}

export interface CreateRatingInputPayload {
  horseId: string;
  authorName: AuthorName;
  rating: RatingValue;
  note: string;
  stallionRecommendation?: string;
}

export interface UpdateRatingInputPayload {
  authorName: AuthorName;
  rating: RatingValue;
  note: string;
  stallionRecommendation?: string;
}
