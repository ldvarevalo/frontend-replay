import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { durationToSeconds } from '#/core/helpers/duration-to-seconds/duration-to-seconds';
import { useRepositories } from '#/repositories/hooks';
import type { ListeningScope, SourceFormat } from '#/types/domain';

/**
 * Types
 */

interface UseCreateSessionData {
  scope: ListeningScope;
  sourceFormat: SourceFormat;
  duration: string; // HH:MM:SS
}

interface UseCreateSessionHook {
  mutate: (data: UseCreateSessionData) => void;
  isPending: boolean;
}

/**
 * useCreateSession
 */

export const useCreateSession = (
  albumId: string | undefined
): UseCreateSessionHook => {
  const queryClient = useQueryClient();
  const { sessions, userReleases } = useRepositories();
  const user = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UseCreateSessionData): Promise<void> => {
      if (!albumId || !user?.id) {
        throw new Error('Missing albumId or user');
      }

      const userRelease = await userReleases.findByRelease(albumId, user.id);

      if (!userRelease) {
        throw new Error(
          'Add this album to your collection first before creating a session'
        );
      }

      await sessions.create({
        userReleaseId: userRelease.id,
        scope: data.scope,
        sourceFormat: data.sourceFormat,
        durationSeconds: durationToSeconds(data.duration),
      });

      await userReleases.markAsListened(userRelease.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['album', albumId],
      });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    mutate,
    isPending,
  };
};
