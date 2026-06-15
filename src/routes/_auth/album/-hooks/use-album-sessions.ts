import { useQuery } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { ListeningSession } from '#/types/domain';

/**
 * Types
 */

interface UseAlbumSessionsHook {
  sessions: ListeningSession[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * useAlbumSessions
 */

export const useAlbumSessions = (
  releaseId: string | undefined
): UseAlbumSessionsHook => {
  const { sessions } = useRepositories();
  const user = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['album-sessions', releaseId, user?.id],
    queryFn: () => sessions.findByRelease(releaseId!, user!.id),
    enabled: !!releaseId && !!user?.id,
  });

  return {
    sessions: data ?? [],
    isLoading,
    isError,
  };
};
