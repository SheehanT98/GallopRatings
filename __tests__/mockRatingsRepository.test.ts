import { createMockRatingsRepository } from '@/features/ratings/data/mockRatingsRepository';

describe('mock ratings repository', () => {
  it('creates rating and returns it in horse history', async () => {
    const repo = createMockRatingsRepository();
    const created = await repo.createRatingInput({
      horseId: 'horse_1',
      authorName: 'Aidan',
      rating: '7+++',
      note: 'Elite balance and scope.',
      stallionRecommendation: 'Dubawi',
    });

    expect(created.horseId).toBe('horse_1');
    expect(created.isStallionRecommended).toBe(true);

    const rows = await repo.getRatingsForHorse('horse_1');
    expect(rows.find((row) => row.id === created.id)).toBeTruthy();
  });

  it('updates an existing rating', async () => {
    const repo = createMockRatingsRepository();
    const current = (await repo.getRatingsForHorse('horse_1'))[0];
    expect(current).toBeTruthy();
    if (!current) return;

    const updated = await repo.updateRatingInput(current.id, {
      authorName: 'Paul',
      rating: '7+',
      note: 'Re-evaluated after breeze.',
      stallionRecommendation: undefined,
    });

    expect(updated.authorName).toBe('Paul');
    expect(updated.rating).toBe('7+');
    expect(updated.isStallionRecommended).toBe(false);
  });

  it('stages and removes report entries', async () => {
    const repo = createMockRatingsRepository();
    const ratings = await repo.getRatings();
    const first = ratings[0];
    expect(first).toBeTruthy();
    if (!first) return;

    const staged = await repo.stageReportItemFromRating(first.id);
    expect(staged.sourceRatingId).toBe(first.id);

    const stagedRows = await repo.getStagedReportItems();
    expect(stagedRows).toHaveLength(1);

    await repo.removeStagedReportItem(staged.id);
    const afterDelete = await repo.getStagedReportItems();
    expect(afterDelete).toHaveLength(0);
  });
});
