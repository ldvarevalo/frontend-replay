import type { SupabaseClient } from '@supabase/supabase-js';
import type { AlbumDetail, SearchResult, Track } from '#/types/domain';
import { formatDuration } from '#/core/helpers/format-duration';
import type { ArtistRole, ReleasesRepository, SearchResults } from '../types';

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
      .or(
        `title.ilike.%${query}%,release_artists.artists.name.ilike.%${query}%`
      )
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
        artist:
          ((
            (r.release_artists as Array<Record<string, unknown>>)?.[0]
              ?.artists as Record<string, unknown>
          )?.name as string) ?? '',
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

  async findById(id: string): Promise<AlbumDetail> {
    const { data, error } = await this.supabase
      .from('releases')
      .select(
        `
        id,
        title,
        cover_url,
        release_year,
        release_artists:release_id (
          artists:artist_id (
            name
          )
        ),
        release_genres:release_id (
          genres:genre_id (
            name
          )
        ),
        tracks:release_id (
          id,
          title,
          duration_seconds,
          side,
          position
        )
      `
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(`Release not found: ${id}`);
    }

    const row = data as Record<string, unknown>;
    const releaseArtists = row.release_artists as
      | Array<Record<string, unknown>>
      | undefined;
    const releaseGenres = row.release_genres as
      | Array<Record<string, unknown>>
      | undefined;
    const tracksData = row.tracks as Array<Record<string, unknown>> | undefined;

    const tracks: Track[] = (tracksData ?? [])
      .sort((a, b) => {
        const aPos = (a.position as number) ?? 0;
        const bPos = (b.position as number) ?? 0;
        return aPos - bPos;
      })
      .map((t, index) => ({
        id: t.id as string,
        thumbnail: (row.cover_url as string) ?? '',
        title: t.title as string,
        artist:
          ((releaseArtists?.[0]?.artists as Record<string, unknown>)
            ?.name as string) ?? '',
        duration: formatDuration(t.duration_seconds as number | null),
        isActive: index === 0,
      }));

    return {
      id: row.id as string,
      coverUrl: (row.cover_url as string) ?? '',
      title: row.title as string,
      artist:
        ((releaseArtists?.[0]?.artists as Record<string, unknown>)
          ?.name as string) ?? '',
      year: (row.release_year as string) ?? '',
      genre:
        ((releaseGenres?.[0]?.genres as Record<string, unknown>)
          ?.name as string) ?? '',
      tracks,
      status: null,
    };
  }
}
