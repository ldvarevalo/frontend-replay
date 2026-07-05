import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  AnalyticsData,
  BacklogEntry,
  CollectionFunnel,
  DiscoverBacklog,
  MostListenedAlbum,
} from '#/types/domain';
import type { AnalyticsRepository } from '../types';

interface ViewRow {
  user_id: string;
  session_id: string;
  duration_seconds: number | null;
  listened_at: string;
  scope: string;
  release_id: string;
  release_title: string;
  cover_url: string | null;
  artist_name: string | null;
  genre_name: string | null;
  status: string;
  is_listened: boolean;
  added_at: string;
}

const extractOldestEntry = (
  rows: Record<string, unknown>[]
): BacklogEntry | undefined => {
  if (rows.length === 0) {
    return undefined;
  }

  const oldest = rows[0];
  const releases = oldest.releases as Record<string, unknown>;
  const releaseArtists = releases.release_artists as Array<
    Record<string, unknown>
  >;
  const artistName =
    ((releaseArtists?.[0]?.artists as Record<string, unknown>)
      ?.name as string) ?? '';
  const addedAt = new Date(oldest.created_at as string);
  const now = new Date();
  const daysSinceAdded = Math.floor(
    (now.getTime() - addedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    coverUrl: (releases.cover_url as string) ?? '',
    title: releases.title as string,
    artist: artistName,
    daysSinceAdded,
  };
};

const computeMostListened = (
  rows: ViewRow[]
): MostListenedAlbum | undefined => {
  const albumDuration = new Map<
    string,
    {
      id: string;
      title: string;
      cover: string | null;
      artist: string;
      dur: number;
      sessions: number;
    }
  >();
  for (const row of rows) {
    const entry = albumDuration.get(row.release_id) ?? {
      id: row.release_id,
      title: row.release_title,
      cover: row.cover_url,
      artist: row.artist_name ?? '',
      dur: 0,
      sessions: 0,
    };
    entry.dur += row.duration_seconds ?? 0;
    entry.sessions += 1;
    albumDuration.set(row.release_id, entry);
  }

  const top = [...albumDuration.values()].sort((a, b) => b.dur - a.dur)[0];
  if (!top) {
    return undefined;
  }

  return {
    id: top.id,
    coverUrl: top.cover ?? '',
    title: top.title,
    artist: top.artist,
    sessionCount: top.sessions,
    totalDurationSeconds: top.dur,
  };
};

const computeTop = (
  rows: ViewRow[],
  field: 'artist_name' | 'genre_name'
): string[] => {
  const freq = new Map<string, number>();
  for (const row of rows) {
    const val = row[field];
    if (val) {
      freq.set(val, (freq.get(val) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);
};

const getDayName = (dateStr: string): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[new Date(dateStr).getDay()];
};

const computePeakDay = (rows: ViewRow[]): string => {
  const freq = new Map<string, number>();
  for (const row of rows) {
    const day = getDayName(row.listened_at);
    freq.set(day, (freq.get(day) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
};

export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async find(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<AnalyticsData> {
    const [viewRows, backlog, funnel] = await Promise.all([
      this.queryViewRows(userId, startDate, endDate),
      this.queryDiscoverBacklog(userId),
      this.queryCollectionFunnel(userId, startDate, endDate),
    ]);

    return {
      ...this.computeSessionMetrics(viewRows),
      ...funnel,
      discoverBacklog: backlog,
    };
  }

  private async queryViewRows(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ViewRow[]> {
    const { data, error } = await this.supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('listened_at', startDate)
      .lte('listened_at', endDate);

    if (error) {
      throw error;
    }
    return (data ?? []) as ViewRow[];
  }

  private async queryDiscoverBacklog(userId: string): Promise<DiscoverBacklog> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select(
        `
        id,
        release_id,
        created_at,
        releases!inner (
          id,
          title,
          cover_url,
          release_artists!inner (
            artists!inner (name)
          )
        )
      `
      )
      .eq('user_id', userId)
      .eq('status', 'discover')
      .eq('is_listened', false)
      .is('archived_at', null)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    return {
      count: rows.length,
      oldestEntry: extractOldestEntry(rows),
    };
  }

  private async queryCollectionFunnel(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    addedToWant: number;
    markedOwned: number;
    collectionFunnel: CollectionFunnel;
  }> {
    const { data, error } = await this.supabase
      .from('user_releases')
      .select('status, created_at, is_listened')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const rows = data ?? [];

    const addedToWant = rows.filter(
      r =>
        r.status === 'want' &&
        r.created_at >= startDate &&
        r.created_at <= endDate
    ).length;

    const markedOwned = rows.filter(
      r =>
        r.status === 'owned' &&
        r.created_at >= startDate &&
        r.created_at <= endDate
    ).length;

    const collectionFunnel: CollectionFunnel = {
      discover: rows.filter(r => r.status === 'discover').length,
      listened: rows.filter(r => r.is_listened).length,
      want: rows.filter(r => r.status === 'want').length,
      owned: rows.filter(r => r.status === 'owned').length,
    };

    return {
      addedToWant,
      markedOwned,
      collectionFunnel: collectionFunnel,
    };
  }

  private computeSessionMetrics(rows: ViewRow[]): {
    listenedAlbums: number;
    listeningTimeSeconds: number;
    mostListenedAlbum?: MostListenedAlbum;
    topArtists: string[];
    topGenres: string[];
    peakActivityDay: string;
    averageSessionSeconds: number;
    completionRate: number;
  } {
    if (rows.length === 0) {
      return {
        listenedAlbums: 0,
        listeningTimeSeconds: 0,
        mostListenedAlbum: undefined,
        topArtists: [],
        topGenres: [],
        peakActivityDay: '',
        averageSessionSeconds: 0,
        completionRate: 0,
      };
    }

    const uniqueAlbums = new Set(rows.map(r => r.release_id));
    const totalDuration = rows.reduce(
      (sum, r) => sum + (r.duration_seconds ?? 0),
      0
    );
    const fullReleaseSessions = rows.filter(
      r => r.scope === 'full_release'
    ).length;

    return {
      listenedAlbums: uniqueAlbums.size,
      listeningTimeSeconds: totalDuration,
      mostListenedAlbum: computeMostListened(rows),
      topArtists: computeTop(rows, 'artist_name'),
      topGenres: computeTop(rows, 'genre_name'),
      peakActivityDay: computePeakDay(rows),
      averageSessionSeconds: Math.round(totalDuration / rows.length),
      completionRate:
        rows.length > 0
          ? Math.round((fullReleaseSessions / rows.length) * 100)
          : 0,
    };
  }
}
