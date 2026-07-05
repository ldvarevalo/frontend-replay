import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';

/**
 * Types
 */

interface UnarchivePayload {
  releaseId: string;
}

interface UseUnarchiveReleaseHook {
  mutate: (payload: UnarchivePayload) => void;
  isPending: boolean;
}

/**
 * useUnarchiveRelease
 */

export const useUnarchiveRelease = (): UseUnarchiveReleaseHook => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { userReleases } = useRepositories();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: UnarchivePayload): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      await userReleases.unarchive(payload.releaseId, user.id);
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
