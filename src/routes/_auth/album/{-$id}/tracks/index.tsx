/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumHero } from '#/components/album-hero';
import { Button } from '#/components/ui/button';
import { router } from '#/router';
import { TrackActionButtons } from './-components/track-action-buttons';
import {
  TrackEntryRow,
  type TrackRowData,
} from './-components/track-entry-row';
import { useCreateTracks } from './-hooks/use-create-tracks';
import { useAlbumData } from '../../-hooks/use-album-data';

/**
 * Types
 */

interface TracksParams {
  id?: string;
}

/**
 * Constants
 */

const SIDES = ['side_a', 'side_b', 'side_c', 'side_d'];

const SIDE_LABELS: Record<string, string> = {
  side_a: 'Side A',
  side_b: 'Side B',
  side_c: 'Side C',
  side_d: 'Side D',
};

let nextRowId = 1;

const createEmptyRow = (side: string, position: number): TrackRowData => ({
  id: `row-${nextRowId++}`,
  title: '',
  durationMinutes: '',
  side,
  position,
});

/**
 * Helpers
 */

const durationStringToSeconds = (value: string): number | null => {
  if (!value.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const parts = trimmed.split(':');

  if (parts.length === 2) {
    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);

    if (isNaN(minutes) || isNaN(seconds)) {
      return null;
    }

    return minutes * 60 + seconds;
  }

  return null;
};

const getNextPosition = (
  rows: TrackRowData[],
  side: string
): number => {
  const sideRows = rows.filter(r => r.side === side);

  if (sideRows.length === 0) {
    return 1;
  }

  return Math.max(...sideRows.map(r => r.position)) + 1;
};

/**
 * TracksPage
 */

// eslint-disable-next-line max-statements
const TracksPage: FunctionComponent = () => {
  const { id } = Route.useParams() as TracksParams;
  const navigate = useNavigate();
  const { album, isLoading, isError } = useAlbumData(id);
  const { mutate: createTracks, isPending } = useCreateTracks();

  const [rows, setRows] = useState<TrackRowData[]>([
    createEmptyRow('side_a', 1),
  ]);

  const [activeSide, setActiveSide] = useState<string>('side_a');

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

  const handleRowChange = (
    rowId: string,
    field: keyof TrackRowData,
    value: string | number
  ): void => {
    setRows(prev =>
      prev.map(row =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const handleRemoveRow = (rowId: string): void => {
    setRows(prev => prev.filter(row => row.id !== rowId));
  };

  const handleAddRow = (): void => {
    setRows(prev => [
      ...prev,
      createEmptyRow(activeSide, getNextPosition(prev, activeSide)),
    ]);
  };

  const handleSubmit = (): void => {
    createTracks(
      {
        albumId: id,
        tracks: rows.map(row => ({
          title: row.title,
          durationSeconds: durationStringToSeconds(row.durationMinutes),
          side: row.side,
          position: row.position,
        })),
      },
      {
        onSuccess: () => {
          navigate({
            to: '/album/$id',
            params: { id },
          });
        },
      }
    );
  };
  const handleCancel = (): void => {
    navigate({
      to: '/album/$id',
      params: { id },
    });
  };

  const hasValidTracks =
    rows.length > 0 && rows.every(row => row.title.trim().length > 0);

  return (
    <div className="flex flex-col">
      <AlbumHero
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
        variant="cover"
      />

      <main className="page-wrap mt-4 space-y-6 pb-8">
        <div className="space-y-4 px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            TRACKS
          </p>

          <div className="flex gap-1">
            {SIDES.map(side => (
              <button
                key={side}
                type="button"
                onClick={() => setActiveSide(side)}
                className={`flex-1 border py-2 text-center text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeSide === side
                    ? 'border-primary bg-primary-container text-on-primary-container'
                    : 'border-outline-20 text-on-surface-variant'
                }`}
              >
                {SIDE_LABELS[side]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {rows.map(row => (
              <TrackEntryRow
                key={row.id}
                track={row}
                sides={SIDES}
                onChange={handleRowChange}
                onRemove={handleRemoveRow}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="flex w-full items-center justify-center gap-2 border border-outline-20 py-3"
            onClick={handleAddRow}
          >
            <p className="text-xs font-bold uppercase tracking-widest">
              + ADD TRACK
            </p>
          </Button>
        </div>

        <TrackActionButtons
          isValid={hasValidTracks}
          isPending={isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
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
  loader: async ({ params }) => ({
    pageHeader: {
      title: 'Crate',
      onBack: () =>
        router.navigate({
          to: '/album/{-$contentId}',
          params: { contentId: params.id },
        }),
    },
  }),
});
