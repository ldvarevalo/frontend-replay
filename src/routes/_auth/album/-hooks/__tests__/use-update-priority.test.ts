import { waitFor } from '@testing-library/react';
import { renderHook } from '@test-utils';
import { setRepositories } from '#/repositories/instance';
import { useUpdatePriority } from '../use-update-priority';

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

const mockUpdatePriority = vi.fn();

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
    musicSearch: { search: async () => [] },
    userReleases: {
      findRecent: async () => [],
      findUpNext: async () => [],
      findAllByUser: async () => [],
      create: async () => {},
      upsert: async () => {},
      findByRelease: async () => null,
      markAsListened: async () => {},
      updatePriority: mockUpdatePriority,
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
      findByRelease: async () => [],
    },
  });
});

/**
 * Tests
 */

describe('useUpdatePriority', () => {
  it('should call updatePriority with correct params', async () => {
    const { result } = renderHook(() => useUpdatePriority());

    result.current.mutate({
      releaseId: 'r-1',
      priority: 'high',
    });

    await waitFor(() => {
      expect(mockUpdatePriority).toHaveBeenCalledWith('r-1', 'user-1', 'high');
    });
  });

  it('should call updatePriority with different priority', async () => {
    const { result } = renderHook(() => useUpdatePriority());

    result.current.mutate({
      releaseId: 'r-2',
      priority: 'low',
    });

    await waitFor(() => {
      expect(mockUpdatePriority).toHaveBeenCalledWith('r-2', 'user-1', 'low');
    });
  });
});
