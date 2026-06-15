/* eslint-disable @typescript-eslint/no-use-before-define */
import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumHero } from '#/components/album-hero';
import { Typography } from '#/components/ui/typography';
import { router } from '#/router';
import { AlbumListeningHistory } from '../-components/album-listening-history';
import { AlbumRating } from '../-components/album-rating';
import { AlbumTags } from '../-components/album-tags';
import { AlbumTracklist } from '../-components/album-tracklist';
import { CollectionStatusSelector } from '../-components/collection-status-selector';
import { useAlbumData } from '../-hooks/use-album-data';
import { useAlbumSessions } from '../-hooks/use-album-sessions';
import { useSetCollectionStatus } from '../-hooks/use-set-collection-status';

/**
 * Types
 */

interface AlbumParams {
  id?: string;
}

/**
 * Constants
 */

const SCOPE_LABELS: Record<string, string> = {
  full_release: 'Full Album',
  side_a: 'Side A',
  side_b: 'Side B',
  side_c: 'Side C',
  side_d: 'Side D',
};

/**
 * AlbumDetailPage
 */

const AlbumDetailPage: FunctionComponent = () => {
  const { id } = Route.useParams() as AlbumParams;
  const navigate = useNavigate();
  const { album, isLoading, isError, error } = useAlbumData(id);
  const { mutate: setStatus } = useSetCollectionStatus();
  const { sessions, isLoading: sessionsLoading } = useAlbumSessions(id);

  if (!id) {
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
          onChange={status => {
            setStatus({
              releaseId: id,
              status,
            });
          }}
        />

        <AlbumRating />

        <AlbumTracklist tracks={album.tracks} />

        <AlbumListeningHistory
          sessions={sessions.map(s => ({
            id: s.id,
            listenedAt: s.listenedAt,
            scopeLabel: SCOPE_LABELS[s.scope] ?? s.scope,
            sourceFormat: s.sourceFormat,
          }))}
          isLoading={sessionsLoading}
          onNewSessionClick={() =>
            navigate({
              to: `/album/${id}/session`,
            })
          }
        />
      </main>
    </div>
  );
};

/**
 * AlbumRoute
 */

export const Route = createFileRoute('/_auth/album/{-$id}/')({
  component: AlbumDetailPage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
      onBack: () => router.history.back(),
    },
  }),
});
