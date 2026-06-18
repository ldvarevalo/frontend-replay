import type { FunctionComponent } from 'react';
import { X } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
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
      <Input
        placeholder="Track title"
        value={track.title}
        onChange={e => onChange(track.id, 'title', e.target.value)}
        className="min-w-0 flex-1"
        aria-label="Track title"
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

    <div className="flex min-w-0 gap-2">
      <Input
        placeholder="M:SS"
        value={track.durationMinutes}
        onChange={e => onChange(track.id, 'durationMinutes', e.target.value)}
        className="min-w-20 flex-1"
        aria-label="Track duration"
      />

      <Input
        type="number"
        placeholder="#"
        value={track.position}
        onChange={e =>
          onChange(track.id, 'position', Number(e.target.value))
        }
        className="min-w-16 flex-1"
        aria-label="Track position"
      />
    </div>

    <Select
      value={track.side}
      onValueChange={v => {
        if (v !== null) {
          onChange(track.id, 'side', v);
        }
      }}
    >
      <SelectTrigger className="w-full" aria-label="Track side">
        <SelectValue>
          {sideOptions.find(o => o.value === track.side)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sideOptions.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
