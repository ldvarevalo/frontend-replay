import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import type { AlbumWithDate } from '#/types/domain';
import { getRelativeTime } from '../-helpers/get-relative-time';

export interface DailyPickCardProps {
  album: AlbumWithDate;
  onListenToday: () => void;
  onShowAnother: () => void;
}

export const DailyPickCard: FunctionComponent<DailyPickCardProps> = ({
  album,
  onListenToday,
  onShowAnother,
}) => (
  <div className="flex gap-4 rounded-sm bg-gradient-to-br from-surface-container-high to-surface-container-highest p-4">
    <div className="flex flex-1 flex-col justify-center">
      <Typography
        size="xs"
        tracking="widest"
        transform="uppercase"
        className="text-on-surface-variant mb-1"
      >
        Today's Pick
      </Typography>
      <Typography family="heading" size="lg" weight="semibold">
        {album.title}
      </Typography>
      <Typography size="sm" className="text-on-surface-variant">
        {album.artist}
      </Typography>
      <Typography size="xs" className="text-on-surface-variant/60 mt-1">
        {getRelativeTime(album.createdAt)}
      </Typography>
      <div className="mt-2 flex items-center gap-3">
        <Button variant="text" onClick={onListenToday}>
          Listen today →
        </Button>
        <button
          type="button"
          onClick={onShowAnother}
          className="text-xs text-on-surface-variant/60 transition-colors hover:text-on-surface-variant"
        >
          Show another
        </button>
      </div>
    </div>
    <div className="size-[100px] flex-shrink-0 overflow-hidden rounded-sm bg-muted">
      <img
        src={album.coverUrl}
        alt={album.title}
        className="h-full w-full object-cover"
      />
    </div>
  </div>
);
