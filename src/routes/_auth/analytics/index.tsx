import { useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { AnalyticsEmptyState } from './-components/analytics-empty-state';
import { AnalyticsSkeleton } from './-components/analytics-skeleton';
import { CollectionFunnel } from './-components/collection-funnel';
import { DiscoverBacklogCard } from './-components/discover-backlog-card';
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
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const { data, isLoading, error, refetch } = useAnalyticsData(period);

  if (isLoading) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold italic tracking-tight text-foreground">
              Analytics
            </h2>
            <p className="text-sm text-on-surface-variant">
              Your listening insights
            </p>
          </div>
        </div>
        <AnalyticsSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <h2 className="font-heading text-2xl font-bold italic tracking-tight text-foreground">
          Analytics
        </h2>
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-on-surface-variant">Couldn't load analytics.</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </main>
    );
  }

  if (!data || data.listenedAlbums === 0) {
    return (
      <main className="page-wrap space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold italic tracking-tight text-foreground">
              Analytics
            </h2>
            <p className="text-sm text-on-surface-variant">
              Your listening insights
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
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
          <h2 className="font-heading text-2xl font-bold italic tracking-tight text-foreground">
            Analytics
          </h2>
          <p className="text-sm text-on-surface-variant">
            Your listening insights
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <MetricCards
        listenedAlbums={data.listenedAlbums}
        listeningTimeSeconds={data.listeningTimeSeconds}
        addedToWant={data.addedToWant}
        markedOwned={data.markedOwned}
      />

      <CollectionFunnel
        discover={data.collectionFunnel.discover}
        listened={data.collectionFunnel.listened}
        want={data.collectionFunnel.want}
        owned={data.collectionFunnel.owned}
        totalEntered={data.listenedAlbums}
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
