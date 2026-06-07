import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Album,
  CollectionAlbum,
  CollectionStatus,
  HomeData,
  HomeStats,
} from '#/types/domain';
import type { UserReleasesRepository } from '../types';

/**
 * Constants
 */

const RECENT_LIMIT = 4;

const RECENT_ALBUM_SELECT = `
  release_id,
  releases!inner (
    id,
    title,
    cover_url
  )
`;

const ALL_FIELDS_SELECT = `
  id,
  status,
  priority,
  rating,
  release_id,
  releases!inner (
    id,
    title,
    cover_url,
    release_year
  )
`;

/**
 * Helpers
 */

const mapCollectionAlbum = (row: Record<string, unknown>): CollectionAlbum => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: '',
    year: (releases.release_year as string) ?? '',
    status: row.status as CollectionStatus,
  };
};

const mapToAlbum = (row: Record<string, unknown>): Album => {
  const releases = row.releases as Record<string, unknown>;

  return {
    id: releases.id as string,
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: '',
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

  async findHomeData(userId: string): Promise<HomeData> {
    const { data: stats, error: statsError } = await this.supabase
      .from('user_releases')
      .select('id, status, created_at')
      .eq('user_id', userId);

    if (statsError) {
      throw statsError;
    }

    const now = new Date();
    const firstOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const homeStats: HomeStats = {
      totalReleases: (stats ?? []).filter(r => r.status !== 'want').length,
      thisMonth: (stats ?? []).filter(r => r.created_at >= firstOfMonth).length,
      wantToListen: (stats ?? []).filter(r => r.status === 'want').length,
    };

    const { data: albums, error: albumsError } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .in('status', ['listened', 'listening'])
      .order('created_at', { ascending: false })
      .limit(RECENT_LIMIT);

    if (albumsError) {
      throw albumsError;
    }

    return {
      stats: homeStats,
      albums: (albums ?? []).map(mapToAlbum),
      tracks: [],
    };
  }

  async findRecent(
    userId: string,
    limit: number
  ): Promise<Album[]> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(RECENT_ALBUM_SELECT)
      .eq('user_id', userId)
      .in('status', ['listened', 'listening'])
      .order('created_at', { ascending: false })
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
}
