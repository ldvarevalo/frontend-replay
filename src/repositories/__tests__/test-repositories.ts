import type {
  Album,
  CollectionAlbum,
  HomeData,
  HomeStats,
  Track,
} from '#/types/domain';
import type {
  Repositories,
  ReleasesRepository,
  StatsRepository,
  TracksRepository,
  UserReleasesRepository,
} from '../types';

/**
 * Constants
 */

const EMPTY_HOME: HomeData = {
  stats: {
    totalReleases: 0,
    thisMonth: 0,
    wantToListen: 0,
  },
  albums: [],
  tracks: [],
};

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
    findHomeData: async () => EMPTY_HOME,
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

  return {
    releases: overrides?.releases ?? noopReleases,
    userReleases: overrides?.userReleases ?? noopUserReleases,
    tracks: overrides?.tracks ?? noopTracks,
    stats: overrides?.stats ?? noopStats,
  };
};
