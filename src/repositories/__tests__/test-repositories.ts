import type {
  Album,
  AlbumDetail,
  AlbumWithDate,
  CollectionAlbum,
  HomeStats,
  Track,
} from '#/types/domain';
import type { Repositories, LookupResult } from '../types';

/**
 * Helpers
 */

const createNoopRepositories = (): Repositories => {
  const noop: Repositories = {
    releases: {
      findByQuery: async () => ({
        results: [],
        totalPages: 0,
      }),
      create: async () => '',
      findById: async (): Promise<AlbumDetail> => ({
        id: '',
        coverUrl: '',
        title: '',
        artist: '',
        year: '',
        genre: '',
        tracks: [],
        status: null,
        isListened: false,
        priority: null,
        addedAt: null,
        archivedAt: null,
      }),
      linkArtist: async () => {},
      linkGenre: async () => {},
    },
    musicSearch: {
      search: async () => [],
    },
    userReleases: {
      findRecent: async (): Promise<Album[]> => [],
      findDailyPick: async (): Promise<AlbumWithDate | null> => null,
      findOldestListened: async (): Promise<Album | null> => null,
      findUpNext: async (): Promise<Album[]> => [],
      findAllByUser: async (): Promise<CollectionAlbum[]> => [],
      create: async () => {},
      upsert: async () => {},
      findByRelease: async () => null,
      markAsListened: async () => {},
      updatePriority: async () => {},
      archive: async () => {},
      unarchive: async () => {},
    },
    tracks: {
      findRecentByUser: async (): Promise<Track[]> => [],
      createMany: async () => {},
      findByRelease: async (): Promise<Track[]> => [],
    },
    stats: {
      findStats: async (): Promise<HomeStats> => ({
        totalReleases: 0,
        thisMonth: 0,
        wantToBuy: 0,
      }),
    },
    artists: {
      findByName: async (): Promise<string | null> => null,
      create: async (name: string): Promise<string> => name,
      search: async (): Promise<LookupResult[]> => [],
    },
    genres: {
      findByName: async (): Promise<string | null> => null,
      create: async (name: string): Promise<string> => name,
      search: async (): Promise<LookupResult[]> => [],
    },
    sessions: {
      create: async () => {},
      findByRelease: async () => [],
    },
    analytics: {
      find: async () => ({
        listenedAlbums: 0,
        listeningTimeSeconds: 0,
        addedToWant: 0,
        markedOwned: 0,
        discoverBacklog: {
          count: 0,
          oldestEntry: undefined,
        },
        mostListenedAlbum: undefined,
        topArtists: [],
        topGenres: [],
        peakActivityDay: '',
        averageSessionSeconds: 0,
        completionRate: 0,
      }),
    },
  };

  return noop;
};

/**
 * createTestRepositories
 */

export const createTestRepositories = (
  overrides?: Partial<Repositories>
): Repositories => ({
  ...createNoopRepositories(),
  ...overrides,
});
