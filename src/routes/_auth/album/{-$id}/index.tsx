/* eslint-disable @typescript-eslint/no-use-before-define */
import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumHero } from '#/components/album-hero';
import { Typography } from '#/components/ui/typography';
import { router } from '#/router';
import { AlbumTags } from '../-components/album-tags';
import { useAlbumData } from '../-hooks/use-album-data';
import { useAlbumSessions } from '../-hooks/use-album-sessions';
import { useSetCollectionStatus } from '../-hooks/use-set-collection-status';
import { useUpdatePriority } from '../-hooks/use-update-priority';
import { AlbumDiscoverSection } from './-components/album-discover-section';
import { AlbumOwnedSection } from './-components/album-owned-section';
import { AlbumWantSection } from './-components/album-want-section';
import { useArchiveRelease } from './-hooks/use-archive-release';
import { useUnarchiveRelease } from './-hooks/use-unarchive-release';

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
  const { mutate: updatePriority } = useUpdatePriority();
  const [{ mutate: archiveRelease }, { mutate: unarchiveRelease }] = [
    useArchiveRelease(),
    useUnarchiveRelease(),
  ];
  const { sessions, isLoading: sessionsLoading } = useAlbumSessions(id);

  if (!id || isError || !album) {
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
            {!id
              ? 'The album ID is missing.'
              : (error?.message ?? 'The album could not be loaded.')}
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

  return (
    <div className={`flex flex-col ${album.archivedAt ? 'opacity-70' : ''}`}>
      <AlbumHero
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
      />

      <main className="page-wrap space-y-6 pb-8">
        <AlbumTags year={album.year} genre={album.genre} />

        {album.status === 'owned' && (
          <AlbumOwnedSection
            album={album}
            sessions={sessions.map(s => ({
              id: s.id,
              listenedAt: s.listenedAt,
              scopeLabel: SCOPE_LABELS[s.scope] ?? s.scope,
              sourceFormat: s.sourceFormat,
            }))}
            sessionsLoading={sessionsLoading}
            onCollectionStatusChange={status =>
              setStatus({
                releaseId: id,
                status,
              })
            }
            onAddTracks={() => navigate({ to: `/album/${id}/tracks` })}
            onNewSession={() => navigate({ to: `/album/${id}/session` })}
          />
        )}

        {album.status === 'want' && (
          <AlbumWantSection
            addedAt={album.addedAt}
            priority={album.priority}
            onPriorityChange={priority =>
              updatePriority({
                releaseId: id,
                priority,
              })
            }
            onMarkAsOwned={() =>
              setStatus({
                releaseId: id,
                status: 'owned',
              })
            }
          />
        )}

        {album.status === 'discover' && (
          <AlbumDiscoverSection
            addedAt={album.addedAt}
            archivedAt={album.archivedAt}
            onAddToWishlist={() =>
              setStatus({
                releaseId: id,
                status: 'want',
              })
            }
            onArchive={() => archiveRelease({ releaseId: id })}
            onUnarchive={() => unarchiveRelease({ releaseId: id })}
          />
        )}
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
