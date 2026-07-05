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
}

export const useAnalyticsData = (period: Period): UseAnalyticsDataResult => {
  const user = useUser();
  const { analytics } = useRepositories();
  const { start, end } = getPeriodDates(period);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', user?.id, period],
    queryFn: () => analytics.find(user!.id, start, end),
    enabled: !!user,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
