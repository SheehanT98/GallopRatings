import type { AuthorName, RatingValue } from '@/features/ratings/types/domain';

export const RATING_OPTIONS: RatingValue[] = ['7+', '7++', '7+++'];
export const AUTHOR_OPTIONS: AuthorName[] = ['MV', 'Paul', 'Aidan'];
export const STALLION_OPTIONS = ['Wootton Bassett', 'Frankel', 'Justify', 'Dubawi'] as const;

export const COHORT_OPTIONS = ['Yearling', 'Foal'] as const;
