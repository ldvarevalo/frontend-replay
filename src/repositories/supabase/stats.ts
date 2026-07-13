import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomeStats } from '#/types/domain';
import type { StatsRepository } from '../types';

/** Helpers */

const getFirstOfMonth = (): string =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

const sumListeningSeconds = async (
  supabase: SupabaseClient,
  releaseIds: string[],
  since: string
): Promise<number> => {
  const { data, error } = await supabase
    .from('listening_sessions')
    .select('duration_seconds')
    .in('user_release_id', releaseIds)
    .gte('listened_at', since);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);
};

/**
 * SupabaseStatsRepository
 */

export class SupabaseStatsRepository implements StatsRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findStats(userId: string): Promise<HomeStats> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select('id, status')
      .eq('user_id', userId)
      .is('archived_at', null);

    if (error) {
      throw error;
    }

    const rows = data ?? [];
    const releaseIds = rows.map(r => r.id);
    const totalSeconds = await sumListeningSeconds(
      this.supabase,
      releaseIds,
      getFirstOfMonth()
    );

    return {
      totalReleases: rows.filter(r => r.status === 'owned').length,
      listeningTimeHours: Math.round(totalSeconds / 3600),
      wantToBuy: rows.filter(r => r.status === 'want').length,
    };
  }
}
