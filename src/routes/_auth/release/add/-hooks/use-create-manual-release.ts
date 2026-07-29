import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '#/core/auth/auth-context';
import { useRepositories } from '#/repositories/hooks';
import type { ManualEntryData } from '#/types/domain';

/**
 * Types
 */

interface UseCreateManualReleaseHook {
  mutate: (data: ManualEntryData) => void;
  mutateAsync: (data: ManualEntryData) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

/**
 * UseCreateManualRelease
 */

export const useCreateManualRelease = (): UseCreateManualReleaseHook => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { releases, artists, genres, userReleases } = useRepositories();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: ManualEntryData): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const findOrCreateArtist = async (name: string): Promise<string> => {
        const existing = await artists.findByName(name);

        if (existing) {
          return existing;
        }

        return artists.create(name);
      };

      const findOrCreateGenre = async (
        name: string
      ): Promise<string | null> => {
        if (!name.trim()) {
          return null;
        }

        const existing = await genres.findByName(name);

        if (existing) {
          return existing;
        }

        return genres.create(name);
      };

      const existingRelease = await releases.findByTitleAndArtist(
        data.title,
        data.artist
      );

      const releaseId =
        existingRelease ??
        (await releases.create({
          title: data.title,
          coverUrl: data.artworkUrl || undefined,
          releaseYear: data.year || undefined,
        }));

      if (!existingRelease) {
        const artistId = await findOrCreateArtist(data.artist);

        await releases.linkArtist(releaseId, artistId);

        const genreId = await findOrCreateGenre(data.genre);

        if (genreId) {
          await releases.linkGenre(releaseId, genreId);
        }
      }

      const existingUserRelease = await userReleases.findByRelease(
        releaseId,
        user.id
      );

      if (!existingUserRelease) {
        await userReleases.create({
          userId: user.id,
          releaseId,
          status: data.status,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-releases'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    mutate,
    mutateAsync,
    isPending,
    error,
  };
};
