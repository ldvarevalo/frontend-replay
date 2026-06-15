import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';

/**
 * Types
 */

export interface TrackRowData {
  id: string;
  title: string;
  durationMinutes: string;
  side: string;
  position: number;
}

interface TrackEntryRowProps {
  track: TrackRowData;
  sides: string[];
  onChange: (id: string, field: keyof TrackRowData, value: string | number) => void;
  onRemove: (id: string) => void;
}

/**
 * TrackEntryRow
 */

export const TrackEntryRow: FunctionComponent<TrackEntryRowProps> = ({
  track,
  sides,
  onChange,
  onRemove,
}) => (
  <div className="flex flex-col gap-2 border-b border-outline-20 pb-3 last:border-b-0">
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Track title"
        value={track.title}
        onChange={e => onChange(track.id, 'title', e.target.value)}
        className="min-w-0 flex-1 border border-outline-20 bg-transparent px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
      />

      <Button
        type="button"
        variant="text"
        onClick={() => onRemove(track.id)}
      >
        ✕
      </Button>
    </div>

    <div className="flex gap-2">
      <input
        type="text"
        placeholder="M:SS"
        value={track.durationMinutes}
        onChange={e => onChange(track.id, 'durationMinutes', e.target.value)}
        className="w-20 border border-outline-20 bg-transparent px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
      />

      <select
        value={track.side}
        onChange={e => onChange(track.id, 'side', e.target.value)}
        className="border border-outline-20 bg-transparent px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
      >
        {sides.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="#"
        value={track.position}
        onChange={e =>
          onChange(track.id, 'position', Number(e.target.value))
        }
        className="w-16 border border-outline-20 bg-transparent px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
      />
    </div>
  </div>
);
