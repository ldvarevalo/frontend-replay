import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, EllipsisVertical, Share } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import { AlbumHero } from './-components/album-hero';
import { AlbumListeningHistory } from './-components/album-listening-history';
import { AlbumRating } from './-components/album-rating';
import { AlbumTags } from './-components/album-tags';
import { AlbumTracklist } from './-components/album-tracklist';
import { CollectionStatusSelector } from './-components/collection-status-selector';
import { useAlbumData } from './-hooks/use-album-data';

/**
 * Types
 */

interface AlbumParams {
  $id?: string;
}

/**
 * AlbumDetailPage
 */

const AlbumDetailPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { $id } = useParams({ from: Route.fullPath }) as AlbumParams;

  if (!$id) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <Typography
            family="heading"
            size="2xl"
            weight="bold"
            className="text-on-surface-variant"
          >
            Album not found
          </Typography>
          <Typography className="mt-2 text-on-surface-variant">
            The album ID is missing.
          </Typography>
        </div>
      </main>
    );
  }

  const { album, isLoading, isError, error } = useAlbumData($id);

  if (isLoading) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <Typography className="text-on-surface-variant">Loading...</Typography>
      </main>
    );
  }

  if (isError || !album) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <Typography
            family="heading"
            size="2xl"
            weight="bold"
            className="text-on-surface-variant"
          >
            Album not found
          </Typography>
          <Typography className="mt-2 text-on-surface-variant">
            {error?.message ?? 'The album could not be loaded.'}
          </Typography>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate({ to: '..' })}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h2 className="font-heading text-2xl font-bold italic tracking-tight">
          Crate
        </h2>
        <div className="flex items-center gap-2">
          <Share className="size-5 text-on-surface-variant" />
          <EllipsisVertical className="size-5 text-on-surface-variant" />
        </div>
      </header>

      {/* Hero */}
      <AlbumHero
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
      />

      {/* Content */}
      <main className="page-wrap space-y-6 pb-8">
        <AlbumTags year={album.year} genre={album.genre} />

        <CollectionStatusSelector
          status={album.status}
          onChange={() => {}}
        />

        <div>
          <Typography
            size="xs"
            transform="uppercase"
            className="text-on-surface-variant"
          >
            YOUR RATING
          </Typography>
          <AlbumRating />
        </div>

        <AlbumTracklist tracks={album.tracks} />

        <AlbumListeningHistory />
      </main>
    </div>
  );
};

/**
 * AlbumRoute
 */

export const Route = createFileRoute('/_auth/album/{-$id}')({
  component: AlbumDetailPage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
    },
  }),
});
