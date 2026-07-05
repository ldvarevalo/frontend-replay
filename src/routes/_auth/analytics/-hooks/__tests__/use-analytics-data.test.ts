import { waitFor } from '@testing-library/react';
import { renderHook } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { setRepositories } from '#/repositories/instance';
import { useAnalyticsData } from '../use-analytics-data';

const useUserMock = vi.spyOn(authModule, 'useUser');
const mockAnalyticsFind = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  useUserMock.mockReturnValue({
    id: 'A.USER.ID',
    email: 'user@example.com',
  });

  setRepositories({
    releases: {
      findByQuery: async () => ({ results: [],
totalPages: 0 }),
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
    musicSearch: { search: async () => [] },
    userReleases: {
      findRecent: async () => [],
      findUpNext: async () => [],
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
      findStats: async () => ({ totalReleases: 0,
thisMonth: 0,
wantToBuy: 0 }),
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
    analytics: { find: mockAnalyticsFind },
  });
});

/**
 * Constants
 */

const ANALYTICS_DATA_MOCK = {
  listenedAlbums: 12,
  listeningTimeSeconds: 31320,
  addedToWant: 4,
  markedOwned: 2,
  collectionFunnel: { discover: 18,
listened: 12,
want: 4,
owned: 10 },
  discoverBacklog: {
    count: 23,
    oldestEntry: {
      coverUrl: 'A.COVER.URL',
      title: 'A.ALBUM.TITLE',
      artist: 'AN.ARTIST.NAME',
      daysSinceAdded: 42,
    },
  },
  mostListenedAlbum: {
    id: 'A.ALBUM.ID',
    coverUrl: 'A.COVER.URL',
    title: 'A.ALBUM.TITLE',
    artist: 'AN.ARTIST.NAME',
    sessionCount: 5,
    totalDurationSeconds: 8100,
  },
  topArtists: ['A.ARTIST.1', 'A.ARTIST.2', 'A.ARTIST.3'],
  topGenres: ['A.GENRE.1', 'A.GENRE.2', 'A.GENRE.3'],
  peakActivityDay: 'Sunday',
  averageSessionSeconds: 1800,
  completionRate: 72,
};

const EMPTY_ANALYTICS_DATA_MOCK = {
  listenedAlbums: 0,
  listeningTimeSeconds: 0,
  addedToWant: 0,
  markedOwned: 0,
  collectionFunnel: { discover: 0,
listened: 0,
want: 0,
owned: 0 },
  discoverBacklog: { count: 0 },
  mostListenedAlbum: undefined,
  topArtists: [],
  topGenres: [],
  peakActivityDay: '',
  averageSessionSeconds: 0,
  completionRate: 0,
};

/**
 * Tests
 */

describe('useAnalyticsData', () => {
  it('should return analytics data from repository', async () => {
    mockAnalyticsFind.mockResolvedValue(ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('this-month'));

    await waitFor(() => {
      expect(result.current.data).toEqual(ANALYTICS_DATA_MOCK);
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockAnalyticsFind).toHaveBeenCalledWith(
      'A.USER.ID',
      expect.any(String),
      expect.any(String)
    );
  });

  it('should return null data when no sessions exist', async () => {
    mockAnalyticsFind.mockResolvedValue(EMPTY_ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('this-month'));

    await waitFor(() => {
      expect(result.current.data?.listenedAlbums).toBe(0);
    });

    expect(result.current.isLoading).toBe(false);
  });
});
