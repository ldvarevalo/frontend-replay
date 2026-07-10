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
  wantToBuy: 0,
};

const RECENT_ALBUMS_LIMIT = 4;
const UP_NEXT_LIMIT = 10;

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

/**
 * UseHomeData
 */

export const useHomeData = (): HomeData => {
  const user = useUser();
  const { stats, userReleases } = useRepositories();

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

  const { data: upNextData } = useQuery({
    queryKey: ['home-up-next', user?.id],
    queryFn: () => userReleases.findUpNext(user!.id, UP_NEXT_LIMIT),
    enabled: !!user,
  });

  return {
    stats: statsData ?? EMPTY_STATS,
    dailyPick: null,
    albums: albumsData ?? [],
    rediscover: null,
    upNext: upNextData ? shuffleArray(upNextData) : [],
    wantToBuyCount: 0,
  };
};
