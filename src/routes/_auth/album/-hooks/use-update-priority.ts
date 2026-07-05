import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { PriorityLevel } from '#/types/domain';

/**
 * Types
 */

interface UseUpdatePriorityHook {
  mutate: (payload: {
    releaseId: string;
    priority: PriorityLevel;
  }) => void;
  isPending: boolean;
}

/**
 * useUpdatePriority
 */

export const useUpdatePriority = (): UseUpdatePriorityHook => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { userReleases } = useRepositories();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: {
      releaseId: string;
      priority: PriorityLevel;
    }): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      await userReleases.updatePriority(
        payload.releaseId,
        user.id,
        payload.priority
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    },
  });

  return { mutate, isPending };
};
