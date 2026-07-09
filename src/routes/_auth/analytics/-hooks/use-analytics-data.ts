import { useQuery } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { AnalyticsData } from '#/types/domain';
import { getPeriodDates, type Period } from '../-helpers/get-period-dates';

interface UseAnalyticsDataResult {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  activePeriod: Period | null;
  isFallback: boolean;
}

const FALLBACK_ORDER: Period[] = [
  'this-month',
  'last-month',
  'this-year',
  'all-time',
];

export const useAnalyticsData = (
  period: Period,
  userSelected = false
): UseAnalyticsDataResult => {
  const user = useUser();
  const { analytics } = useRepositories();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', user?.id, period, userSelected],
    queryFn: async () => {
      if (userSelected) {
        const { start, end } = getPeriodDates(period);
        const result = await analytics.find(user!.id, start, end);

        return {
          data: result.listenedAlbums > 0 ? result : null,
          activePeriod: result.listenedAlbums > 0 ? period : null,
          isFallback: false,
        };
      }

      for (const candidate of FALLBACK_ORDER) {
        const { start, end } = getPeriodDates(candidate);
        const result = await analytics.find(user!.id, start, end);

        if (result.listenedAlbums > 0) {
          return {
            data: result,
            activePeriod: candidate,
            isFallback: candidate !== period,
          };
        }
      }

      return {
        data: null,
        activePeriod: null,
        isFallback: false,
      };
    },
    enabled: !!user,
  });

  return {
    data: data?.data ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
    activePeriod: data?.activePeriod ?? null,
    isFallback: data?.isFallback ?? false,
  };
};
