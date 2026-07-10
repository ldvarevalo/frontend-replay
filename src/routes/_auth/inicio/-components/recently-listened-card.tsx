import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

export interface RecentlyListenedCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  onClick: () => void;
}

export const RecentlyListenedCard: FunctionComponent<
  RecentlyListenedCardProps
> = ({ coverUrl, title, artist, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-3 rounded-sm border border-outline-variant bg-surface-container-low p-2 text-left transition-opacity hover:opacity-80"
  >
    <div className="size-14 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
      <img
        src={coverUrl}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="min-w-0 flex-1">
      <Typography family="heading" size="sm" weight="semibold" className="truncate">
        {title}
      </Typography>
      <Typography
        size="xs"
        tracking="widest"
        uppercase
        className="truncate text-on-surface-variant"
      >
        {artist}
      </Typography>
    </div>
  </button>
);
