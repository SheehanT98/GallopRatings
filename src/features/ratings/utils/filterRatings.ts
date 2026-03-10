import type { RatingFilters, RatingInput } from '@/features/ratings/types/domain';

const includesCaseInsensitive = (source: string, query: string): boolean =>
  source.toLowerCase().includes(query.trim().toLowerCase());

export const filterRatings = (ratings: RatingInput[], filters?: RatingFilters): RatingInput[] => {
  if (!filters) {
    return ratings;
  }

  return ratings.filter((item) => {
    if (filters.horseName && !includesCaseInsensitive(item.horseName, filters.horseName)) {
      return false;
    }
    if (filters.authorName && item.authorName !== filters.authorName) {
      return false;
    }
    if (filters.rating && item.rating !== filters.rating) {
      return false;
    }
    if (filters.fromDate && item.noteDate < filters.fromDate) {
      return false;
    }
    if (filters.toDate && item.noteDate > filters.toDate) {
      return false;
    }
    return true;
  });
};
