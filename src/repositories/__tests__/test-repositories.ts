import { vi } from 'vitest';
import type {
  Album,
  AlbumDetail,
  AlbumWithDate,
  AlbumWithListenedAt,
  CollectionAlbum,
  HomeStats,
  Track,
} from '#/types/domain';
import type { Repositories, LookupResult } from '../types';

/**
 * Types
 */

type RepositoryOverrides = {
  [K in keyof Repositories]?: Partial<Repositories[K]>;
};

/**
 * Helpers
 */

const createNoopRepositories = (): Repositories => ({
  releases: {
    findByQuery: vi.fn().mockResolvedValue({
      results: [],
      totalPages: 0,
    }),
    findByTitleAndArtist: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(''),
    findById: vi.fn().mockResolvedValue({
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
    } satisfies AlbumDetail),
    linkArtist: vi.fn().mockResolvedValue(undefined),
    linkGenre: vi.fn().mockResolvedValue(undefined),
  },
  musicSearch: {
    search: vi.fn().mockResolvedValue([]),
  },
  userReleases: {
    findRecent: vi.fn().mockResolvedValue([] satisfies AlbumWithListenedAt[]),
    findDailyPick: vi
      .fn()
      .mockResolvedValue(null satisfies AlbumWithDate | null),
    findOldestListened: vi.fn().mockResolvedValue(null satisfies Album | null),
    findUpNext: vi.fn().mockResolvedValue([] satisfies Album[]),
    findAllByUser: vi.fn().mockResolvedValue([] satisfies CollectionAlbum[]),
    create: vi.fn().mockResolvedValue(undefined),
    upsert: vi.fn().mockResolvedValue(undefined),
    findByRelease: vi.fn().mockResolvedValue(null),
    markAsListened: vi.fn().mockResolvedValue(undefined),
    updatePriority: vi.fn().mockResolvedValue(undefined),
    archive: vi.fn().mockResolvedValue(undefined),
    unarchive: vi.fn().mockResolvedValue(undefined),
  },
  tracks: {
    findRecentByUser: vi.fn().mockResolvedValue([] satisfies Track[]),
    createMany: vi.fn().mockResolvedValue(undefined),
    findByRelease: vi.fn().mockResolvedValue([] satisfies Track[]),
  },
  stats: {
    findStats: vi.fn().mockResolvedValue({
      totalReleases: 0,
      listeningTimeHours: 0,
      wantToBuy: 0,
    } satisfies HomeStats),
  },
  artists: {
    findByName: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((name: string) => Promise.resolve(name)),
    search: vi.fn().mockResolvedValue([] satisfies LookupResult[]),
  },
  genres: {
    findByName: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation((name: string) => Promise.resolve(name)),
    search: vi.fn().mockResolvedValue([] satisfies LookupResult[]),
  },
  sessions: {
    create: vi.fn().mockResolvedValue(undefined),
    findByRelease: vi.fn().mockResolvedValue([]),
  },
  analytics: {
    find: vi.fn().mockResolvedValue({
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
});

/**
 * createTestRepositories
 */

export const createTestRepositories = (
  overrides?: RepositoryOverrides
): Repositories => {
  const noop = createNoopRepositories();

  if (!overrides) {
    return noop;
  }

  const result = { ...noop } as Record<keyof Repositories, unknown>;

  for (const key of Object.keys(overrides) as Array<keyof Repositories>) {
    const override = overrides[key];

    if (!override) {
      continue;
    }

    result[key] = {
      ...noop[key],
      ...override,
    };
  }

  return result as Repositories;
};
