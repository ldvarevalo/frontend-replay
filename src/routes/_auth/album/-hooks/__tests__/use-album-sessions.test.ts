import { waitFor } from '@testing-library/react';
import { renderHook } from '@test-utils';
import { setRepositories } from '#/repositories/instance';
import { useAlbumSessions } from '../use-album-sessions';

/**
 * Mocks
 */

vi.mock('#/core/auth/auth-context', async () => {
  const actual = await vi.importActual('#/core/auth/auth-context');

  return {
    ...actual,
    useUser: () => ({
      id: 'user-1',
      email: 'test@example.com',
    }),
  };
});

const mockFindByRelease = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
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
      }),
      linkArtist: async () => {},
      linkGenre: async () => {},
    },
    musicSearch: {
      search: async () => [],
    },
    userReleases: {
      findRecent: async () => [],
      findUpNext: async () => [],
      findAllByUser: async () => [],
      create: async () => {},
      upsert: async () => {},
      findByRelease: async () => null,
      markAsListened: async () => {},
      updatePriority: async () => {},
    },
    tracks: {
      findRecentByUser: async () => [],
      createMany: async () => {},
      findByRelease: async () => [],
    },
    stats: {
      findStats: async () => ({
        totalReleases: 0,
        thisMonth: 0,
        wantToBuy: 0,
      }),
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
      findByRelease: mockFindByRelease,
    },
  });
});

/**
 * Tests
 */

describe('useAlbumSessions', () => {
  it('should return sessions when data is fetched', async () => {
    const mockSessions = [
      {
        id: 'session-1',
        userReleaseId: 'ur-1',
        scope: 'full_release',
        sourceFormat: 'vinyl' as const,
        durationSeconds: 1800,
        listenedAt: '2026-06-15T10:00:00Z',
        createdAt: '2026-06-15T10:00:00Z',
      },
    ];

    mockFindByRelease.mockResolvedValue(mockSessions);

    const { result } = renderHook(() => useAlbumSessions('release-1'));

    await waitFor(() => {
      expect(result.current.sessions).toEqual(mockSessions);
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockFindByRelease).toHaveBeenCalledWith('release-1', 'user-1');
  });

  it('should return empty array when no sessions exist', async () => {
    mockFindByRelease.mockResolvedValue([]);

    const { result } = renderHook(() => useAlbumSessions('release-1'));

    await waitFor(() => {
      expect(result.current.sessions).toEqual([]);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty array when releaseId is undefined', () => {
    const { result } = renderHook(() => useAlbumSessions(undefined));

    expect(result.current.sessions).toEqual([]);
    expect(mockFindByRelease).not.toHaveBeenCalled();
  });
});
