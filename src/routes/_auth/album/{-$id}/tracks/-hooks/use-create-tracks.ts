import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepositories } from '#/repositories/hooks';
import type { TrackInput } from '#/repositories/types';

/**
 * Types
 */

interface UseCreateTracksData {
  albumId: string;
  tracks: TrackInput[];
}

interface UseCreateTracksCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

interface UseCreateTracksHook {
  mutate: (data: UseCreateTracksData, callbacks?: UseCreateTracksCallbacks) => void;
  isPending: boolean;
}

/**
 * useCreateTracks
 */

export const useCreateTracks = (): UseCreateTracksHook => {
  const queryClient = useQueryClient();
  const { tracks } = useRepositories();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UseCreateTracksData): Promise<void> => {
      await tracks.createMany(data.albumId, data.tracks);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['album', variables.albumId],
      });
    },
  });

  return {
    mutate: (data, callbacks) => {
      mutate(data, {
        onSuccess: () => {
          callbacks?.onSuccess?.();
        },
        onError: (error) => {
          callbacks?.onError?.(error);
        },
      });
    },
    isPending,
  };
};
