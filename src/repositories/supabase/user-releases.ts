import type { SupabaseClient } from '@supabase/supabase-js';
import type { Album, CollectionAlbum, CollectionStatus } from '#/types/domain';
import type { UserReleasesRepository } from '../types';

/**
 * Constants
 */

const RECENT_ALBUM_SELECT = `
  release_id,
  status,
  releases!inner (
    id,
    title,
    cover_url,
    release_artists!inner (
      artists!inner (
        name
      )
    )
  )
`;

const ALL_FIELDS_SELECT = `
  id,
  status,
  priority,
  rating,
  is_listened,
  listened_at,
  release_id,
  releases!inner (
    id,
    title,
    cover_url,
    release_year,
    release_artists!inner (
      artists!inner (
        name
      )
    )
  )
`;

/**
 * Helpers
 */

const getArtistName = (releases: Record<string, unknown>): string => {
  const releaseArtists = releases.release_artists as
    | Array<Record<string, unknown>>
    | undefined;

  return (
    ((releaseArtists?.[0]?.artists as Record<string, unknown>)
      ?.name as string) ?? ''
  );
};

const mapCollectionAlbum = (row: Record<string, unknown>): CollectionAlbum => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
    year: (releases.release_year as string) ?? '',
    status: row.status as CollectionStatus,
    isListened: row.is_listened as boolean,
  };
};

const mapToAlbum = (row: Record<string, unknown>): Album => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: getArtistName(releases),
  };
};

/**
 * SupabaseUserReleasesRepository
 */

export class SupabaseUserReleasesRepository implements UserReleasesRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findRecent(userId: string, limit: number): Promise<Album[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .eq('is_listened', true)
      .order('listened_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapToAlbum);
  }

  async findUpNext(userId: string, limit: number): Promise<Album[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .eq('is_listened', false)
      .in('status', ['discover', 'owned'])
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapToAlbum);
  }

  async findAllByUser(userId: string): Promise<CollectionAlbum[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(ALL_FIELDS_SELECT)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapCollectionAlbum);
  }

  async create(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void> {
    const { error } = await this.supabase.from('user_releases').insert({
      user_id: data.userId,
      release_id: data.releaseId,
      status: data.status,
    });

    if (error) {
      throw error;
    }
  }

  async upsert(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void> {
    const { error } = await this.supabase.from('user_releases').upsert(
      {
        user_id: data.userId,
        release_id: data.releaseId,
        status: data.status,
      },
      {
        onConflict: 'user_id,release_id',
      }
    );

    if (error) {
      throw error;
    }
  }

  async findByRelease(
    releaseId: string,
    userId: string
  ): Promise<{ id: string } | null> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select('id')
      .eq('release_id', releaseId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  async markAsListened(userReleaseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_releases')
      .update({
        is_listened: true,
        listened_at: new Date().toISOString(),
      })
      .eq('id', userReleaseId);

    if (error) {
      throw error;
    }
  }
}
