import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

export interface RecentlyListenedCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  listenedAt: string;
  onClick: () => void;
}

/**
 * Helpers
 */

const formatRelativeTime = (date: string): string => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  const [, unit] = intervals.find(([s]) => seconds >= s) ?? [60, 'minute'];
  const value = Math.floor(
    seconds / (intervals.find(([s]) => seconds >= s)?.[0] ?? 60)
  );

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    -value,
    unit
  );
};

/**
 * RecentlyListenedCard
 */

export const RecentlyListenedCard: FunctionComponent<
  RecentlyListenedCardProps
> = ({ coverUrl, title, artist, listenedAt, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-3 rounded-sm bg-surface-container-low p-2 text-left transition-opacity hover:opacity-80"
  >
    <div className="size-14 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
      <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
    </div>
    <div className="min-w-0 flex-1">
      <Typography
        family="heading"
        size="sm"
        weight="semibold"
        className="truncate"
      >
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
      <Typography size="xs" className="text-on-surface-variant">
        {formatRelativeTime(listenedAt)}
      </Typography>
    </div>
  </button>
);
