/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, type FunctionComponent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AlbumHero } from '#/components/album-hero';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import type { TrackInput } from '#/repositories/types';
import { router } from '#/router';
import { AddTracksDialog } from './-components/add-tracks-dialog';
import { TracksEmptyState } from './-components/tracks-empty-state';
import { TracksList } from './-components/tracks-list';
import { TracksSummary } from './-components/tracks-summary';
import { useCreateTracks } from './-hooks/use-create-tracks';
import { useTracksBySide } from './-hooks/use-tracks-by-side';
import { useAlbumData } from '../../-hooks/use-album-data';

/**
 * Types
 */

interface TracksParams {
  id?: string;
}

/**
 * TracksPage
 */

// eslint-disable-next-line max-statements
const TracksPage: FunctionComponent = () => {
  const { id } = Route.useParams() as TracksParams;
  const { album, isLoading, isError } = useAlbumData(id);
  const { bySide, totalCount, totalDurationSeconds } = useTracksBySide(
    album?.tracks ?? []
  );
  const { mutate: createTracks, isPending } = useCreateTracks();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDialogOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setErrorMessage(null);
    }
    setDialogOpen(nextOpen);
  };

  const handleSubmit = (tracks: TrackInput[]): void => {
    if (!id) {
      return;
    }

    setErrorMessage(null);
    createTracks(
      {
        albumId: id,
        tracks,
      },
      {
        onSuccess: () => {
          handleDialogOpenChange(false);
        },
        onError: (error: unknown) => {
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to save tracks'
          );
        },
      }
    );
  };

  if (!id) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-on-surface-variant text-lg font-bold">
            Album not found
          </p>
          <p className="mt-2 text-on-surface-variant">
            The album ID is missing.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <p className="text-on-surface-variant">Loading...</p>
      </main>
    );
  }

  if (isError || !album) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-on-surface-variant text-lg font-bold">
            Album not found
          </p>
          <p className="mt-2 text-on-surface-variant">
            The album could not be loaded.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col">
      <AlbumHero
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
      />

      <main className="page-wrap mt-4 space-y-6 pb-8">
        <div className="space-y-4 px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            TRACKS
          </p>

          {totalCount > 0 && (
            <TracksSummary
              totalCount={totalCount}
              totalDurationSeconds={totalDurationSeconds}
            />
          )}

          {totalCount === 0 ? (
            <TracksEmptyState onAddClick={() => setDialogOpen(true)} />
          ) : (
            <TracksList bySide={bySide} />
          )}

          {totalCount > 0 && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setDialogOpen(true)}
            >
              <Typography
                size="xs"
                weight="bold"
                transform="uppercase"
                tracking="widest"
              >
                + ADD TRACKS
              </Typography>
            </Button>
          )}
        </div>

        <AddTracksDialog
          open={dialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          errorMessage={errorMessage}
          existingTracksCount={album.tracks.length}
        />
      </main>
    </div>
  );
};

/**
 * TracksRoute
 */

export const Route = createFileRoute('/_auth/album/{-$id}/tracks/')({
  component: TracksPage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
      onBack: () => router.history.back(),
    },
  }),
});
