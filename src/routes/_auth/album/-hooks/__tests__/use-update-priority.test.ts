import { useQueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@test-utils';
import * as authModule from '#/core/auth/auth-context';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
import { setRepositories } from '#/repositories/instance';
import { useUpdatePriority } from '../use-update-priority';

/**
 * Mocks
 */

const useUserMock = vi.spyOn(authModule, 'useUser');
const updatePriority = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  useUserMock.mockReturnValue({
    id: 'A.USER.ID',
    email: 'user@example.com',
  });

  setRepositories(
    createTestRepositories({
      userReleases: { updatePriority },
    })
  );
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
      expect(updatePriority).toHaveBeenCalledWith(
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
      expect(updatePriority).toHaveBeenCalledWith(
        'ANOTHER.RELEASE.ID',
        'A.USER.ID',
        'low'
      );
    });
  });

  it('should invalidate the album query after a successful update', async () => {
    const queryClient = renderHook(() => useQueryClient()).result.current;
    const albumKey = ['album', 'A.RELEASE.ID', 'A.USER.ID'];

    queryClient.setQueryData(albumKey, { priority: 'low' });

    const { result } = renderHook(() => useUpdatePriority());

    result.current.mutate({
      releaseId: 'A.RELEASE.ID',
      priority: 'high',
    });

    await waitFor(() => {
      expect(queryClient.getQueryState(albumKey)?.isInvalidated).toBe(true);
    });
  });
});
