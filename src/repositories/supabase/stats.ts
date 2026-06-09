import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomeStats } from '#/types/domain';
import type { StatsRepository } from '../types';

/**
 * SupabaseStatsRepository
 */

export class SupabaseStatsRepository implements StatsRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findStats(userId: string): Promise<HomeStats> {
    const now = new Date();
    const firstOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const { data, error } = await this.supabase
      .from('user_releases')
      .select('id, status, created_at')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    const totalReleases = rows.filter(r => r.status !== 'want').length;

    const thisMonth = rows.filter(r => r.created_at >= firstOfMonth).length;

    const wantToListen = rows.filter(r => r.status === 'want').length;

    return {
      totalReleases,
      thisMonth,
      wantToListen,
    };
  }
}
