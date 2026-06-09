import type { SupabaseClient } from '@supabase/supabase-js';
import type { Track } from '#/types/domain';
import type { TracksRepository } from '../types';

/**
 * Helpers
 */

const formatDuration = (seconds: number | null): string => {
  if (seconds === null || seconds === undefined) {
    return '--:--';
  }

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, '0')}`;
};

const mapTrack = (
  row: Record<string, unknown>,
  index: number
): Track => {
  const releases = row.releases as Record<string, unknown> | undefined;
  const releaseArtists = (
    row.release_artists as Array<Record<string, unknown>> | undefined
  );

  return {
    id: row.id as string,
    thumbnail: (releases?.cover_url as string) ?? '',
    title: row.title as string,
    artist: (
      releaseArtists?.[0]?.artists as Record<string, unknown>
    )?.name as string ?? '',
    duration: formatDuration(row.duration_seconds as number | null),
    isActive: index === 0,
  };
};

/**
 * SupabaseTracksRepository
 */

export class SupabaseTracksRepository implements TracksRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findRecentByUser(
    userId: string,
    limit: number
  ): Promise<Track[]> {
    const { data: userReleases, error: urError } = await this.supabase
      .from('user_releases')
      .select('release_id')
      .eq('user_id', userId)
      .eq('status', 'listened')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (urError) {
      throw urError;
    }

    const releaseIds = (userReleases ?? []).map(r => r.release_id);

    if (releaseIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('tracks')
      .select(
        `
        id,
        title,
        duration_seconds,
        side,
        position,
        releases:release_id (
          id,
          cover_url
        ),
        release_artists:release_id (
          artists:artist_id (
            name
          )
        )
      `
      )
      .in('release_id', releaseIds)
      .order('position', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((row: unknown, index: number) =>
      mapTrack(row as Record<string, unknown>, index)
    );
  }
}
