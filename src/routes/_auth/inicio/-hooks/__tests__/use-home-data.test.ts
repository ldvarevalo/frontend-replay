import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
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

    setRepositories(
      createTestRepositories({
        stats: { findStats: vi.fn().mockResolvedValue(MOCK_STATS) },
        userReleases: {
          findRecent: vi.fn().mockResolvedValue([...MOCK_RECENT]),
          findDailyPick: vi.fn().mockResolvedValue(MOCK_DAILY_PICK),
          findOldestListened: vi.fn().mockResolvedValue(MOCK_REDISCOVER),
          findUpNext: vi.fn().mockResolvedValue([...MOCK_UP_NEXT]),
        },
      })
    );
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
