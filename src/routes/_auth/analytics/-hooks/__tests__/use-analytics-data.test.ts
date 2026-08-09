import { useQueryClient } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
import { setRepositories } from '#/repositories/instance';
import { useAnalyticsData } from '../use-analytics-data';

const useUserMock = vi.spyOn(authModule, 'useUser');
const analyticsFind = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  renderHook(() => {
    const queryClient = useQueryClient();
    queryClient.clear();
  });

  useUserMock.mockReturnValue({
    id: 'A.USER.ID',
    email: 'user@example.com',
  });

  setRepositories(
    createTestRepositories({
      analytics: { find: analyticsFind },
    })
  );
});

/**
 * Constants
 */

const ANALYTICS_DATA_MOCK = {
  listenedAlbums: 12,
  listeningTimeSeconds: 31320,
  addedToWant: 4,
  markedOwned: 2,
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
  it('should return data when this-month has sessions', async () => {
    analyticsFind.mockResolvedValue(ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('this-month'));

    await waitFor(() => {
      expect(result.current.data).toEqual(ANALYTICS_DATA_MOCK);
    });

    expect(result.current.isFallback).toBe(false);
    expect(result.current.activePeriod).toBe('this-month');
  });

  it('should fallback to last-month when this-month is empty', async () => {
    analyticsFind
      .mockResolvedValueOnce(EMPTY_ANALYTICS_DATA_MOCK)
      .mockResolvedValueOnce(ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('this-month'));

    await waitFor(() => {
      expect(result.current.data).toEqual(ANALYTICS_DATA_MOCK);
    });

    expect(result.current.isFallback).toBe(true);
    expect(result.current.activePeriod).toBe('last-month');
  });

  it('should return null when all periods are empty', async () => {
    analyticsFind.mockResolvedValue(EMPTY_ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('this-month'));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });

    expect(result.current.isFallback).toBe(false);
    expect(result.current.activePeriod).toBeNull();
  });

  it('should not fallback when userSelected is true', async () => {
    analyticsFind.mockResolvedValue(EMPTY_ANALYTICS_DATA_MOCK);

    const { result } = renderHook(() => useAnalyticsData('last-month', true));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });

    expect(result.current.activePeriod).toBeNull();
    expect(analyticsFind).toHaveBeenCalledTimes(1);
  });
});
