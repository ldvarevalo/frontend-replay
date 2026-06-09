import { useQuery } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { HomeData, HomeStats } from '#/types/domain';

/**
 * Constants
 */

const EMPTY_STATS: HomeStats = {
  totalReleases: 0,
  thisMonth: 0,
  wantToListen: 0,
};

const RECENT_ALBUMS_LIMIT = 4;
const NEXT_TRACKS_LIMIT = 5;

/**
 * UseHomeData
 */

export const useHomeData = (): HomeData => {
  const user = useUser();
  const { stats, userReleases, tracks } = useRepositories();

  const { data: statsData } = useQuery({
    queryKey: ['home-stats', user?.id],
    queryFn: () => stats.findStats(user!.id),
    enabled: !!user,
  });

  const { data: albumsData } = useQuery({
    queryKey: ['home-recent', user?.id],
    queryFn: () => userReleases.findRecent(user!.id, RECENT_ALBUMS_LIMIT),
    enabled: !!user,
  });

  const { data: tracksData } = useQuery({
    queryKey: ['home-tracks', user?.id],
    queryFn: () => tracks.findRecentByUser(user!.id, NEXT_TRACKS_LIMIT),
    enabled: !!user,
  });

  return {
    stats: statsData ?? EMPTY_STATS,
    albums: albumsData ?? [],
    tracks: tracksData ?? [],
  };
};
