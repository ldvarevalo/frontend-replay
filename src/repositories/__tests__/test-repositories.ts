import type {
  Album,
  CollectionAlbum,
  HomeStats,
  Track,
} from '#/types/domain';
import type {
  ArtistsRepository,
  GenresRepository,
  Repositories,
  ReleasesRepository,
  StatsRepository,
  TracksRepository,
  UserReleasesRepository,
} from '../types';

/**
 * createTestRepositories
 */

export const createTestRepositories = (
  overrides?: Partial<Repositories>
): Repositories => {
  const noopReleases: ReleasesRepository = {
    findByQuery: async () => ({
      results: [],
      totalPages: 0,
    }),
  };

  const noopUserReleases: UserReleasesRepository = {
    findRecent: async (): Promise<Album[]> => [],
    findAllByUser: async (): Promise<CollectionAlbum[]> => [],
    create: async () => {
    },
  };

  const noopTracks: TracksRepository = {
    findRecentByUser: async (): Promise<Track[]> => [],
  };

  const noopStats: StatsRepository = {
    findStats: async (): Promise<HomeStats> => ({
      totalReleases: 0,
      thisMonth: 0,
      wantToListen: 0,
    }),
  };

  const noopArtists: ArtistsRepository = {
    findByName: async (): Promise<string | null> => null,
    create: async (name: string): Promise<string> => name,
  };

  const noopGenres: GenresRepository = {
    findByName: async (): Promise<string | null> => null,
    create: async (name: string): Promise<string> => name,
  };

  return {
    releases: overrides?.releases ?? noopReleases,
    userReleases: overrides?.userReleases ?? noopUserReleases,
    tracks: overrides?.tracks ?? noopTracks,
    stats: overrides?.stats ?? noopStats,
    artists: overrides?.artists ?? noopArtists,
    genres: overrides?.genres ?? noopGenres,
  };
};
