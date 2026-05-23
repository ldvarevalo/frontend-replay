import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumCard } from '#/components/album-card';
import { AlbumRow } from '#/components/album-row';
import { SectionHeader } from '#/components/section-header';
import { BannerCta } from './-components/banner-cta';
import { StatsCard } from './-components/stats-card';
import { useHomeData } from './-hooks/use-home-data';

/**
 * HomePage
 */

const HomePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { stats, albums, tracks } = useHomeData();

  return (
    <main className="page-wrap space-y-6 py-6">
      <StatsCard
        totalReleases={stats.totalReleases}
        thisMonth={stats.thisMonth}
      />
      <BannerCta
        count={stats.wantToListen}
        onClick={() => navigate({ to: '/want-to-listen' })}
      />
      <SectionHeader
        title="Recently Listened"
        onLinkClick={() => navigate({ to: '/recent' })}
      />
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
      <div className="flex flex-col">
        {tracks.map(track => (
          <AlbumRow
            key={track.id}
            thumbnail={track.thumbnail}
            title={track.title}
            artist={track.artist}
            duration={track.duration}
            isActive={track.isActive}
            onClick={() => navigate({ to: `/album/${track.id}` })}
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
