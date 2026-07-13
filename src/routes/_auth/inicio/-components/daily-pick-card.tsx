import type { FunctionComponent } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import type { AlbumWithDate } from '#/types/domain';
import { getRelativeTime } from '../-helpers/get-relative-time';

/**
 * Types
 */

export interface DailyPickCardProps {
  album: AlbumWithDate;
  onListenToday: () => void;
  onShowAnother: () => void;
}

/**
 * DailyPickCard
 */

export const DailyPickCard: FunctionComponent<DailyPickCardProps> = ({
  album,
  onListenToday,
  onShowAnother,
}) => (
  <div className="flex flex-col gap-4 rounded-sm bg-gradient-to-br from-surface-container-high to-surface-container-highest p-4">
    <div className="flex justify-between gap-8">
      <div className="flex flex-col">
        <Typography
          size="xs"
          tracking="widest"
          transform="uppercase"
          className="text-on-surface-variant mb-2"
        >
          Today's Pick
        </Typography>
        <div className="mt-6">
          <Typography as="p" family="heading" size="lg" weight="semibold">
            {album.title}
          </Typography>
          <Typography size="sm" className="text-on-surface-variant">
            {album.artist}
          </Typography>
          <Typography size="xs" className="text-on-surface-variant/60 mt-1">
            {getRelativeTime(album.createdAt)}
          </Typography>
        </div>
      </div>
      <div className="size-40 shrink-0 -mr-6 mt-8 overflow-hidden rounded-sm bg-muted">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    <div className="mt-2 flex items-center justify-between gap-3">
      <Button variant="text" onClick={onListenToday}>
        Listen today
        <ChevronRight />
      </Button>
      <Button variant="link" onClick={onShowAnother}>
        <RefreshCw /> Show another
      </Button>
    </div>
  </div>
);
