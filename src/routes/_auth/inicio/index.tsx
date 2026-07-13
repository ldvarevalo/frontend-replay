import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SectionHeader } from '#/components/section-header';
import { Typography } from '#/components/ui/typography';
import { BannerCta } from './-components/banner-cta';
import { DailyPickCard } from './-components/daily-pick-card';
import { RecentlyListenedCard } from './-components/recently-listened-card';
import { RediscoverCard } from './-components/rediscover-card';
import { StatsCard } from './-components/stats-card';
import { UpNextList } from './-components/up-next-list';
import { useHomeData } from './-hooks/use-home-data';

/**
 * HomePage
 */

export const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    stats,
    dailyPick,
    albums,
    rediscover,
    upNext,
    wantToBuyCount,
    handleShowAnother,
  } = useHomeData();

  return (
    <main className="page-wrap space-y-6 py-6">
      {dailyPick && (
        <DailyPickCard
          album={dailyPick}
          onListenToday={() => navigate({ to: `/album/${dailyPick.id}` })}
          onShowAnother={handleShowAnother}
        />
      )}

      <StatsCard
        collectionCount={stats.totalReleases}
        listeningHours={stats.listeningTimeHours}
      />

      <BannerCta
        count={wantToBuyCount}
        onClick={() => navigate({ to: '/collection?want' })}
      />

      <SectionHeader title="Recently Listened" />
      <div className="grid grid-cols-2 gap-4">
        {albums.map(album => (
          <RecentlyListenedCard
            key={album.id}
            coverUrl={album.coverUrl}
            title={album.title}
            artist={album.artist}
            listenedAt={album.listenedAt}
            onClick={() => navigate({ to: `/album/${album.id}` })}
          />
        ))}
      </div>

      {rediscover && (
        <>
          <SectionHeader title="Rediscover" />
          <RediscoverCard
            coverUrl={rediscover.coverUrl}
            title={rediscover.title}
            artist={rediscover.artist}
            onClick={() => navigate({ to: `/album/${rediscover.id}` })}
          />
        </>
      )}

      <SectionHeader title="Up Next" />
      {upNext.length > 0 ? (
        <UpNextList
          albums={upNext}
          onAlbumClick={album => navigate({ to: `/album/${album.id}` })}
        />
      ) : (
        <Typography className="text-on-surface-variant" size="sm">
          All caught up!
        </Typography>
      )}
    </main>
  );
};

/**
 * HomeRoute
 */

export const Route = createFileRoute('/_auth/inicio/')({
  component: HomePage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
    },
  }),
});
