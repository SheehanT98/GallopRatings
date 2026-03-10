import { createMockRatingsRepository } from '@/features/ratings/data/mockRatingsRepository';
import type { RatingsRepository } from '@/features/ratings/data/ratingsRepository';
import { SupabaseRatingsRepository } from '@/features/ratings/data/supabaseRatingsRepository';
import { getSupabaseClient } from '@/lib/supabase/client';

export const createDefaultRatingsRepository = (): RatingsRepository => {
  const client = getSupabaseClient();
  if (!client) {
    return createMockRatingsRepository();
  }
  return new SupabaseRatingsRepository();
};
