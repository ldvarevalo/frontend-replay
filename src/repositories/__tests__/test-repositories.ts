import type { Album, CollectionAlbum, HomeStats, Track } from '#/types/domain';
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
      linkArtist: async () => {},
      linkGenre: async () => {},
    },
    userReleases: {
      findRecent: async (): Promise<Album[]> => [],
      findAllByUser: async (): Promise<CollectionAlbum[]> => [],
      create: async () => {},
    },
    tracks: {
      findRecentByUser: async (): Promise<Track[]> => [],
    },
    stats: {
      findStats: async (): Promise<HomeStats> => ({
        totalReleases: 0,
        thisMonth: 0,
        wantToListen: 0,
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
