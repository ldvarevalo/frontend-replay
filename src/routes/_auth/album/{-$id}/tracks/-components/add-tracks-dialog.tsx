import { useRef, useState, type FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '#/components/ui/dialog';
import { Typography } from '#/components/ui/typography';
import { TRACK_SIDE_OPTIONS } from '#/core/helpers/listening-scope-labels';
import type { TrackInput } from '#/repositories/types';
import { TrackEntryRow, type TrackRowData } from './track-entry-row';

/**
 * Types
 */

interface AddTracksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tracks: TrackInput[]) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
  existingTracksCount: number;
}

/**
 * Constants
 */

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

/**
 * AddTracksDialog
 */

const AddTracksDialog: FunctionComponent<AddTracksDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  errorMessage,
  existingTracksCount,
}) => {
  const initialPosition = existingTracksCount + 1;

  const [rows, setRows] = useState<TrackRowData[]>([
    createEmptyRow('side_a', initialPosition),
  ]);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

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
    setRows(prev => {
      const lastSide = prev[prev.length - 1]?.side ?? 'side_a';

      return [
        ...prev,
        createEmptyRow(lastSide, existingTracksCount + prev.length + 1),
      ];
    });
    setTimeout(() => {
      rowsContainerRef.current?.scrollTo({
        top: rowsContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  };

  const handleSubmit = (): void => {
    onSubmit(
      rows.map(row => ({
        title: row.title,
        durationSeconds: durationStringToSeconds(row.durationMinutes),
        side: row.side,
        position: row.position,
      }))
    );
  };

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setRows([createEmptyRow('side_a', initialPosition)]);
    }
    onOpenChange(nextOpen);
  };

  const hasValidTracks =
    rows.length > 0 && rows.every(row => row.title.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[min(32rem,calc(100%-2rem))]">
        <DialogTitle>
          <Typography
            size="xs"
            weight="bold"
            transform="uppercase"
            tracking="widest"
            className="text-on-surface-variant"
          >
            ADD TRACKS
          </Typography>
        </DialogTitle>

        <div
          ref={rowsContainerRef}
          className="min-h-0 max-h-[50vh] space-y-3 overflow-y-auto"
        >
          {rows.map(row => (
            <TrackEntryRow
              key={row.id}
              track={row}
              sideOptions={TRACK_SIDE_OPTIONS}
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
          <Typography
            size="xs"
            weight="bold"
            transform="uppercase"
            tracking="widest"
          >
            + ADD ROW
          </Typography>
        </Button>

        {errorMessage !== null && (
          <Typography size="sm" role="alert" className="text-destructive">
            {errorMessage}
          </Typography>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!hasValidTracks || isSubmitting}
            onClick={handleSubmit}
          >
            <Typography
              size="sm"
              weight="bold"
              transform="uppercase"
              tracking="widest"
              className="text-on-primary-container"
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Typography>
          </Button>
          <DialogClose
            render={
              <Button type="button" variant="text" size="lg" />
            }
          >
            <Typography
              size="sm"
              weight="bold"
              transform="uppercase"
              tracking="widest"
              className="text-on-surface-variant"
            >
              CANCEL
            </Typography>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AddTracksDialog };
