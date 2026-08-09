import { useQueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
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

  setRepositories(
    createTestRepositories({
      sessions: {
        create: sessionsCreateMock,
      },
      userReleases: {
        findByRelease: findByReleaseMock,
        markAsListened: markAsListenedMock,
      },
    })
  );
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
