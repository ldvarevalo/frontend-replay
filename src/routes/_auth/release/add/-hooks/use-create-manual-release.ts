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

interface LinkDeps {
  releases: ReturnType<typeof useRepositories>['releases'];
  artists: ReturnType<typeof useRepositories>['artists'];
  genres: ReturnType<typeof useRepositories>['genres'];
}

/**
 * Helpers
 */

const findOrCreateArtist = async (
  artists: LinkDeps['artists'],
  name: string
): Promise<string> => {
  const existing = await artists.findByName(name);

  if (existing) {
    return existing;
  }

  return artists.create(name);
};

const findOrCreateGenre = async (
  genres: LinkDeps['genres'],
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

const linkNewReleaseMetadata = async (
  deps: LinkDeps,
  releaseId: string,
  data: ManualEntryData
): Promise<void> => {
  const artistId = await findOrCreateArtist(deps.artists, data.artist);

  await deps.releases.linkArtist(releaseId, artistId);

  const genreId = await findOrCreateGenre(deps.genres, data.genre);

  if (genreId) {
    await deps.releases.linkGenre(releaseId, genreId);
  }
};

/**
 * UseCreateManualRelease
 */

export const useCreateManualRelease = (): UseCreateManualReleaseHook => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { releases, artists, genres, userReleases } = useRepositories();
  const deps: LinkDeps = {
    releases,
    artists,
    genres,
  };

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: ManualEntryData): Promise<void> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const existingRelease = await releases.findByTitleAndArtist(
        data.title.trim(),
        data.artist.trim()
      );

      const releaseId =
        existingRelease ??
        (await releases.create({
          title: data.title,
          coverUrl: data.artworkUrl || undefined,
          releaseYear: data.year || undefined,
        }));

      if (!existingRelease) {
        await linkNewReleaseMetadata(deps, releaseId, data);
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
