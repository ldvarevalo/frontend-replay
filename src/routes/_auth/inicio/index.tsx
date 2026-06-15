import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumCard } from '#/components/album-card';
import { SectionHeader } from '#/components/section-header';
import { BannerCta } from './-components/banner-cta';
import { StatsCard } from './-components/stats-card';
import { useHomeData } from './-hooks/use-home-data';

/**
 * HomePage
 */

const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { stats, albums, upNext } = useHomeData();

  return (
    <main className="page-wrap space-y-6 py-6">
      <StatsCard
        totalReleases={stats.totalReleases}
        thisMonth={stats.thisMonth}
      />
      <BannerCta
        count={stats.wantToBuy}
        onClick={() => navigate({ to: '/whishlist' })}
      />
      <SectionHeader title="Recently Listened" />
      <div className="grid grid-cols-2 gap-4">
        {albums.map(album => (
          <AlbumCard
            key={album.id}
            coverUrl={album.coverUrl}
            title={album.title}
            artist={album.artist}
            onClick={() => navigate({ to: `/album/${album.id}` })}
          />
        ))}
      </div>
      <SectionHeader title="Up Next" />
      <div className="grid grid-cols-2 gap-4">
        {upNext.map(album => (
          <AlbumCard
            key={album.id}
            coverUrl={album.coverUrl}
            title={album.title}
            artist={album.artist}
            onClick={() => navigate({ to: `/album/${album.id}` })}
          />
        ))}
      </div>
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
