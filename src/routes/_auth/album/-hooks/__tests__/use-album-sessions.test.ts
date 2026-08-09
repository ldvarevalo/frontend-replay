import { waitFor } from '@testing-library/react';
import { renderHook } from '@test-utils';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
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

const findByRelease = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  setRepositories(
    createTestRepositories({
      sessions: {
        findByRelease,
      },
    })
  );
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

    findByRelease.mockResolvedValue(mockSessions);

    const { result } = renderHook(() => useAlbumSessions('release-1'));

    await waitFor(() => {
      expect(result.current.sessions).toEqual(mockSessions);
    });

    expect(result.current.isLoading).toBe(false);
    expect(findByRelease).toHaveBeenCalledWith('release-1', 'user-1');
  });

  it('should return empty array when no sessions exist', async () => {
    findByRelease.mockResolvedValue([]);

    const { result } = renderHook(() => useAlbumSessions('release-1'));

    await waitFor(() => {
      expect(result.current.sessions).toEqual([]);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty array when releaseId is undefined', () => {
    const { result } = renderHook(() => useAlbumSessions(undefined));

    expect(result.current.sessions).toEqual([]);
    expect(findByRelease).not.toHaveBeenCalled();
  });
});
