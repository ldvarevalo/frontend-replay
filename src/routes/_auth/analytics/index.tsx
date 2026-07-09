import { useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import { AnalyticsEmptyState } from './-components/analytics-empty-state';
import { AnalyticsSkeleton } from './-components/analytics-skeleton';
import { DiscoverBacklogCard } from './-components/discover-backlog-card';
import { FallbackBanner } from './-components/fallback-banner';
import { HabitsList } from './-components/habits-list';
import { MetricCards } from './-components/metric-cards';
import { MostListenedCard } from './-components/most-listened-card';
import { PeriodSelector } from './-components/period-selector';
import { TopArtists } from './-components/top-artists';
import { TopGenres } from './-components/top-genres';
import type { Period } from './-helpers/get-period-dates';
import { useAnalyticsData } from './-hooks/use-analytics-data';

/**
 * Constants
 */

const DEFAULT_PERIOD: Period = 'this-month';

/**
 * AnalyticsPage
 */

const AnalyticsPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [userSelected, setUserSelected] = useState(false);
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const { data, isLoading, error, refetch, activePeriod, isFallback } =
    useAnalyticsData(period, userSelected);

  const handlePeriodChange = (next: Period): void => {
    setUserSelected(true);
    setPeriod(next);
  };

  if (isLoading) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography
              family="heading"
              size="xl"
              weight="bold"
              tracking="tight"
              as="h2"
              className="text-foreground"
            >
              Analytics
            </Typography>
            <Typography size="sm" className="text-on-surface-variant">
              Your listening insights
            </Typography>
          </div>
        </div>
        <AnalyticsSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <Typography
          family="heading"
          size="xl"
          weight="bold"
          tracking="tight"
          as="h2"
          className="text-foreground"
        >
          Analytics
        </Typography>
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-on-surface-variant">Couldn't load analytics.</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography
              variant="display"
              as="h2"
              className="text-foreground"
            >
              Analytics
            </Typography>
            <Typography size="sm" className="text-on-surface-variant">
              Your listening insights
            </Typography>
          </div>
          <PeriodSelector value={period} onChange={handlePeriodChange} />
        </div>
        <AnalyticsEmptyState
          onLogFirstSession={() => navigate({ to: '/release/add' })}
        />
      </main>
    );
  }

  return (
    <main className="page-wrap space-y-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <Typography
            variant="display"
            as="h2"
            className="text-foreground"
          >
            Analytics
          </Typography>
          <Typography size="sm" className="text-on-surface-variant">
            Your listening insights
          </Typography>
        </div>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
      </div>

      {isFallback && activePeriod && <FallbackBanner period={activePeriod} />}

      <MetricCards
        listenedAlbums={data.listenedAlbums}
        listeningTimeSeconds={data.listeningTimeSeconds}
        addedToWant={data.addedToWant}
        markedOwned={data.markedOwned}
      />

      <DiscoverBacklogCard
        count={data.discoverBacklog.count}
        oldestEntry={data.discoverBacklog.oldestEntry}
        onNavigateToDiscover={() => navigate({ to: '/collection' })}
      />

      {data.mostListenedAlbum && (
        <MostListenedCard
          album={data.mostListenedAlbum}
          onViewAlbum={id => navigate({ to: `/album/${id}` })}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <TopArtists artists={data.topArtists} />
        <TopGenres genres={data.topGenres} />
      </div>

      <HabitsList
        peakActivityDay={data.peakActivityDay}
        averageSessionSeconds={data.averageSessionSeconds}
        completionRate={data.completionRate}
      />
    </main>
  );
};

/**
 * AnalyticsRoute
 */

export const Route = createFileRoute('/_auth/analytics/')({
  component: AnalyticsPage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
    },
  }),
});
