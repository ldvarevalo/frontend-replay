import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';

/**
 * Types
 */

interface ArchivePayload {
  releaseId: string;
}

interface UseArchiveReleaseHook {
  mutate: (payload: ArchivePayload) => void;
  isPending: boolean;
}

/**
 * useArchiveRelease
 */

export const useArchiveRelease = (): UseArchiveReleaseHook => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { userReleases } = useRepositories();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ArchivePayload): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      await userReleases.archive(payload.releaseId, user.id);
    },
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({
        queryKey: ['album', payload.releaseId],
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
