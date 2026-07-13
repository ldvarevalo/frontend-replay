import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { setRepositories } from '#/repositories/instance';
import type {
  Album,
  AlbumWithDate,
  AlbumWithListenedAt,
  HomeStats,
} from '#/types/domain';
import { useHomeData } from '../use-home-data';

/**
 * Mocks
 */

const useUserMock = vi.spyOn(authModule, 'useUser');

/**
 * Constants
 */

const MOCK_STATS = {
  totalReleases: 100,
  listeningTimeHours: 5,
  wantToBuy: 3,
} as const satisfies HomeStats;

const MOCK_DAILY_PICK = {
  id: 'A.DAILY.PICK.ID',
  coverUrl: '',
  title: 'A.DAILY.PICK',
  artist: 'AN.ARTIST',
  createdAt: '2024-01-01T00:00:00Z',
} as const satisfies AlbumWithDate;

const MOCK_RECENT = [
  {
    id: 'A.RECENT.ONE',
    coverUrl: '',
    title: 'A.RECENT.ALBUM',
    artist: 'AN.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'A.RECENT.TWO',
    coverUrl: '',
    title: 'ANOTHER.RECENT',
    artist: 'ANOTHER.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'A.RECENT.THREE',
    coverUrl: '',
    title: 'A.THIRD.ALBUM',
    artist: 'A.THIRD.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'A.RECENT.FOUR',
    coverUrl: '',
    title: 'A.FOURTH.ALBUM',
    artist: 'A.FOURTH.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
] as const satisfies AlbumWithListenedAt[];

const MOCK_REDISCOVER = {
  id: 'A.REDISCOVER.ID',
  coverUrl: '',
  title: 'AN.OLD.ALBUM',
  artist: 'AN.OLD.ARTIST',
} as const satisfies Album;

const MOCK_UP_NEXT = [
  {
    id: 'A.UP.NEXT.ONE',
    coverUrl: '',
    title: 'AN.UP.NEXT',
    artist: 'AN.ARTIST',
  },
  {
    id: 'A.UP.NEXT.TWO',
    coverUrl: '',
    title: 'ANOTHER.UP.NEXT',
    artist: 'ANOTHER.ARTIST',
  },
] as const satisfies Album[];

/**
 * Tests
 */

describe('useHomeData', () => {
  beforeEach(() => {
    useUserMock.mockReturnValue({
      id: 'A.USER.ID',
      email: 'user@example.com',
    });

    setRepositories({
      releases: {
        findByQuery: async () => ({
          results: [],
          totalPages: 0,
        }),
        create: async () => '',
        findById: async () => ({
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
        findRecent: async () => [...MOCK_RECENT],
        findDailyPick: async () => MOCK_DAILY_PICK,
        findOldestListened: async () => MOCK_REDISCOVER,
        findUpNext: async () => [...MOCK_UP_NEXT],
        findAllByUser: async () => [],
        create: async () => {},
        upsert: async () => {},
        findByRelease: async () => null,
        markAsListened: async () => {},
        updatePriority: async () => {},
        archive: async () => {},
        unarchive: async () => {},
      },
      tracks: {
        findRecentByUser: async () => [],
        createMany: async () => {},
        findByRelease: async () => [],
      },
      stats: {
        findStats: async () => MOCK_STATS,
      },
      artists: {
        findByName: async () => null,
        create: async (name: string) => name,
        search: async () => [],
      },
      genres: {
        findByName: async () => null,
        create: async (name: string) => name,
        search: async () => [],
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
          discoverBacklog: { count: 0 },
          mostListenedAlbum: undefined,
          topArtists: [],
          topGenres: [],
          peakActivityDay: '',
          averageSessionSeconds: 0,
          completionRate: 0,
        }),
      },
    });
  });

  it('should return all home data sections', async () => {
    const { result } = renderHook(() => useHomeData());

    await waitFor(() => {
      expect(result.current.stats.totalReleases).toBe(100);
    });

    expect(result.current.dailyPick?.title).toBe('A.DAILY.PICK');
    expect(result.current.albums).toHaveLength(4);
    expect(result.current.rediscover?.title).toBe('AN.OLD.ALBUM');
    expect(result.current.upNext).toHaveLength(2);
    expect(result.current.wantToBuyCount).toBe(3);
  });
});
