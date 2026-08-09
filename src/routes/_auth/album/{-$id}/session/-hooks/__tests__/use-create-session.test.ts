import { useQueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { setRepositories } from '#/repositories/instance';
import { useCreateSession } from '../use-create-session';

/**
 * Mocks
 */

const useUserMock = vi.spyOn(authModule, 'useUser');
const sessionsCreateMock = vi.fn();
const findByReleaseMock = vi.fn();
const markAsListenedMock = vi.fn();

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
      findByTitleAndArtist: async () => null,
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
      findDailyPick: async () => null,
      findOldestListened: async () => null,
      findUpNext: async () => [],
      findAllByUser: async () => [],
      create: async () => {},
      upsert: async () => {},
      findByRelease: findByReleaseMock,
      markAsListened: markAsListenedMock,
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
      findStats: async () => ({
        totalReleases: 0,
        listeningTimeHours: 0,
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
      create: sessionsCreateMock,
      findByRelease: async () => [],
    },
    analytics: {
      find: async () => ({
        listenedAlbums: 0,
        listeningTimeSeconds: 0,
        addedToWant: 0,
        markedOwned: 0,
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

describe('useCreateSession', () => {
  it('should create the session and mark the release as listened', async () => {
    findByReleaseMock.mockResolvedValue({ id: 'A.USER.RELEASE.ID' });

    const { result } = renderHook(() => useCreateSession('A.RELEASE.ID'));

    result.current.mutate({
      scope: 'full_release',
      sourceFormat: 'vinyl',
      duration: '003000',
    });

    await waitFor(() => {
      expect(sessionsCreateMock).toHaveBeenCalledWith({
        userReleaseId: 'A.USER.RELEASE.ID',
        scope: 'full_release',
        sourceFormat: 'vinyl',
        durationSeconds: 30 * 60,
      });
    });

    await waitFor(() => {
      expect(markAsListenedMock).toHaveBeenCalledWith('A.USER.RELEASE.ID');
    });
  });

  it('should invalidate the album-sessions query after a successful create', async () => {
    findByReleaseMock.mockResolvedValue({ id: 'A.USER.RELEASE.ID' });

    const queryClient = renderHook(() => useQueryClient()).result.current;
    const sessionsKey = ['album-sessions', 'A.RELEASE.ID', 'A.USER.ID'];

    queryClient.setQueryData(sessionsKey, []);

    const { result } = renderHook(() => useCreateSession('A.RELEASE.ID'));

    result.current.mutate({
      scope: 'full_release',
      sourceFormat: 'vinyl',
      duration: '003000',
    });

    await waitFor(() => {
      expect(queryClient.getQueryState(sessionsKey)?.isInvalidated).toBe(true);
    });
  });

  it('should call the onSuccess callback after a successful create', async () => {
    findByReleaseMock.mockResolvedValue({ id: 'A.USER.RELEASE.ID' });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useCreateSession('A.RELEASE.ID'));

    result.current.mutate(
      {
        scope: 'full_release',
        sourceFormat: 'vinyl',
        duration: '003000',
      },
      { onSuccess }
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
