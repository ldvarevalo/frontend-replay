import type { FunctionComponent } from 'react';
import { X } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { SideOption } from '#/core/helpers/listening-scope-labels';

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
  sideOptions: SideOption[];
  onChange: (id: string, field: keyof TrackRowData, value: string | number) => void;
  onRemove: (id: string) => void;
}

/**
 * TrackEntryRow
 */

export const TrackEntryRow: FunctionComponent<TrackEntryRowProps> = ({
  track,
  sideOptions,
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
        aria-label="Remove track"
      >
        <X className="size-4" />
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

      <Select
        value={track.side}
        onValueChange={v => {
          if (v !== null) {
            onChange(track.id, 'side', v);
          }
        }}
      >
        <SelectTrigger className="w-32" aria-label="Track side">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sideOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
