import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { ListeningScope } from '#/types/domain';

/**
 * Types
 */

interface UseLogListeningSessionData {
  scope: ListeningScope;
}

interface UseLogListeningSessionHook {
  mutate: (data: UseLogListeningSessionData) => void;
  isPending: boolean;
}

/**
 * useLogListeningSession
 */

export const useLogListeningSession = (
  albumId: string | undefined
): UseLogListeningSessionHook => {
  const queryClient = useQueryClient();
  const { sessions, userReleases } = useRepositories();
  const user = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UseLogListeningSessionData): Promise<void> => {
      if (!albumId || !user?.id) {
        throw new Error('Missing albumId or user');
      }

      const userRelease = await userReleases.findByRelease(albumId, user.id);

      if (!userRelease) {
        throw new Error(
          'Add this album to your collection first before logging a session'
        );
      }

      await sessions.create({
        userReleaseId: userRelease.id,
        scope: data.scope,
        sourceFormat: 'digital',
        durationSeconds: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['album', albumId],
      });
      queryClient.invalidateQueries({
        queryKey: ['album-sessions', albumId],
      });
    },
  });

  return {
    mutate,
    isPending,
  };
};
