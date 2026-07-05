import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { setRepositories } from '#/repositories/instance';
import { useUpdatePriority } from '../use-update-priority';

/**
 * Mocks
 */

const useUserMock = vi.spyOn(authModule, 'useUser');
const updatePriorityMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

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
    musicSearch: { search: async () => [] },
    userReleases: {
      findRecent: async () => [],
      findUpNext: async () => [],
      findAllByUser: async () => [],
      create: async () => {},
      upsert: async () => {},
      findByRelease: async () => null,
      markAsListened: async () => {},
      updatePriority: updatePriorityMock,
      archive: async () => {},
      unarchive: async () => {},
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
    analytics: {
      find: async () => ({
        listenedAlbums: 0,
        listeningTimeSeconds: 0,
        addedToWant: 0,
        markedOwned: 0,
        collectionFunnel: {
          discover: 0,
          listened: 0,
          want: 0,
          owned: 0,
        },
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
});

/**
 * Tests
 */

describe('useUpdatePriority', () => {
  it('should call updatePriority with release ID and priority', async () => {
    const { result } = renderHook(() => useUpdatePriority());

    result.current.mutate({
      releaseId: 'A.RELEASE.ID',
      priority: 'high',
    });

    await waitFor(() => {
      expect(updatePriorityMock).toHaveBeenCalledWith(
        'A.RELEASE.ID',
        'A.USER.ID',
        'high'
      );
    });
  });

  it('should call updatePriority with another priority', async () => {
    const { result } = renderHook(() => useUpdatePriority());

    result.current.mutate({
      releaseId: 'ANOTHER.RELEASE.ID',
      priority: 'low',
    });

    await waitFor(() => {
      expect(updatePriorityMock).toHaveBeenCalledWith(
        'ANOTHER.RELEASE.ID',
        'A.USER.ID',
        'low'
      );
    });
  });
});
