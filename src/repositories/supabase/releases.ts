import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AlbumDetail,
  CollectionStatus,
  SearchResult,
  Track,
} from '#/types/domain';
import type { ArtistRole, ReleasesRepository, SearchResults } from '../types';

/**
 * Helpers
 */

const getPrimaryName = (
  items: Array<Record<string, unknown>> | undefined,
  key: string
): string =>
  ((items?.[0]?.[key] as Record<string, unknown>)?.name as string) ?? '';

const sortByPosition = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
): number => ((a.position as number) ?? 0) - ((b.position as number) ?? 0);

const mapTrackRow = (t: Record<string, unknown>): Track => ({
  id: t.id as string,
  title: t.title as string,
  durationSeconds: (t.duration_seconds as number) ?? null,
  side: (t.side as string) ?? '',
  position: (t.position as number) ?? 0,
});

const mapAlbumDetailRow = (row: Record<string, unknown>): AlbumDetail => {
  const releaseArtists = row.release_artists as
    | Array<Record<string, unknown>>
    | undefined;
  const releaseGenres = row.release_genres as
    | Array<Record<string, unknown>>
    | undefined;
  const artist = getPrimaryName(releaseArtists, 'artists');
  const coverUrl = (row.cover_url as string) ?? '';

  const tracks: Track[] = (
    (row.tracks as Array<Record<string, unknown>> | undefined) ?? []
  )
    .sort(sortByPosition)
    .map(t => mapTrackRow(t));

  const userReleases = row.user_releases as
    | Array<Record<string, unknown>>
    | undefined;
  const status = (userReleases?.[0]?.status as CollectionStatus | null) ?? null;
  const isListened = (userReleases?.[0]?.is_listened as boolean) ?? false;

  return {
    id: row.id as string,
    coverUrl,
    title: row.title as string,
    artist,
    year: (row.release_year as string) ?? '',
    genre: getPrimaryName(releaseGenres, 'genres'),
    tracks,
    status,
    isListened,
  };
};

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
    const escapedQuery = query.replaceAll('%', '\\%').replaceAll('_', '\\_');
    const pattern = `%${escapedQuery}%`;

    const { data, error, count } = await this.supabase
      .from('releases_search')
      .select('id, title, cover_url, release_year, primary_artist_name', {
        count: 'exact',
        head: false,
      })
      .or(`title.ilike.${pattern},primary_artist_name.ilike.${pattern}`)
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
        artist: (r.primary_artist_name as string) ?? '',
        isAdded: false,
      };
    });

    return {
      results,
      totalPages: count ? Math.ceil(count / pageSize) : 1,
    };
  }

  async create(data: {
    title: string;
    coverUrl?: string;
    releaseYear?: string;
  }): Promise<string> {
    const { data: result, error } = await this.supabase
      .from('releases')
      .insert({
        title: data.title,
        cover_url: data.coverUrl ?? null,
        release_year: data.releaseYear ?? null,
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return result.id;
  }

  async linkArtist(
    releaseId: string,
    artistId: string,
    role: ArtistRole = 'primary'
  ): Promise<void> {
    const { error } = await this.supabase.from('release_artists').insert({
      release_id: releaseId,
      artist_id: artistId,
      role,
    });

    if (error) {
      throw error;
    }
  }

  async linkGenre(releaseId: string, genreId: string): Promise<void> {
    const { error } = await this.supabase.from('release_genres').insert({
      release_id: releaseId,
      genre_id: genreId,
    });

    if (error) {
      throw error;
    }
  }

  async findById(id: string, userId?: string): Promise<AlbumDetail> {
    let query = this.supabase
      .from('releases')
      .select(
        `
        id,
        title,
        cover_url,
        release_year,
        release_artists (
          artists:artist_id (
            name
          )
        ),
        release_genres (
          genres:genre_id (
            name
          )
        ),
        tracks (
          id,
          title,
          duration_seconds,
          side,
          position
        ),
        user_releases!left (
          status,
          is_listened,
          listened_at
        )
      `
      )
      .eq('id', id);

    if (userId) {
      query = query.eq('user_releases.user_id', userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      throw new Error(`Release not found: ${id}`);
    }

    return mapAlbumDetailRow(data as Record<string, unknown>);
  }
}
