import { filterRatings } from '@/features/ratings/utils/filterRatings';
import type { RatingInput } from '@/features/ratings/types/domain';

const rows: RatingInput[] = [
  {
    id: '1',
    horseId: 'h1',
    horseName: 'Silver Banner',
    authorName: 'MV',
    rating: '7++',
    note: 'A',
    noteDate: '2026-03-01T00:00:00.000Z',
    isStallionRecommended: false,
  },
  {
    id: '2',
    horseId: 'h2',
    horseName: 'Dawn Crest',
    authorName: 'Paul',
    rating: '7+',
    note: 'B',
    noteDate: '2026-03-02T00:00:00.000Z',
    isStallionRecommended: false,
  },
];

describe('filterRatings', () => {
  it('filters by horse name case-insensitively', () => {
    const result = filterRatings(rows, { horseName: 'silver' });
    expect(result).toHaveLength(1);
    expect(result[0]?.horseName).toBe('Silver Banner');
  });

  it('filters by author and rating', () => {
    const result = filterRatings(rows, { authorName: 'Paul', rating: '7+' });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });

  it('filters by date range', () => {
    const result = filterRatings(rows, {
      fromDate: '2026-03-02T00:00:00.000Z',
      toDate: '2026-03-02T23:59:59.000Z',
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });
});
