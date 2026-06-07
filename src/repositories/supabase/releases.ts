import type { SupabaseClient } from '@supabase/supabase-js';
import type { SearchResult } from '#/types/domain';
import type { ReleasesRepository, SearchResults } from '../types';

/**
 * SupabaseReleasesRepository
 */

export class SupabaseReleasesRepository implements ReleasesRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findByQuery(
    query: string,
    page: number,
    pageSize: number
  ): Promise<SearchResults> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.supabase
      .from('releases')
      .select(
        `
        id,
        title,
        cover_url,
        release_artists!inner (
          artists!inner (
            name
          )
        )
      `,
        {
          count: 'exact',
          head: false,
        }
      )
      .or(`title.ilike.%${query}%,release_artists.artists.name.ilike.%${query}%`)
      .range(from, to);

    if (error) {
      throw error;
    }

    const results: SearchResult[] = (data ?? []).map(row => {
      const r = row as Record<string, unknown>;

      return {
        id: r.id as string,
        thumbnail: (r.cover_url as string) ?? '',
        title: r.title as string,
        artist: (
          (r.release_artists as Array<Record<string, unknown>>)?.[0]
            ?.artists as Record<string, unknown>
        )?.name as string ?? '',
        isAdded: false,
      };
    });

    return {
      results,
      totalPages: count ? Math.ceil(count / pageSize) : 1,
    };
  }
}
