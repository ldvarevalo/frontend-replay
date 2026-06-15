import { useMutation } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
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
 * Helpers
 */

const durationToSeconds = (duration: string): number | null => {
  if (!duration) {
    return null;
  }
  const parts = duration.split(':').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return null;
  }
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
};

/**
 * useCreateSession
 */

export const useCreateSession = (
  albumId: string | undefined
): UseCreateSessionHook => {
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
    },
  });

  return {
    mutate,
    isPending,
  };
};
