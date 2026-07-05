import type { FunctionComponent, ReactNode } from 'react';
import { Typography } from '#/components/ui/typography';
import { cn } from '#/lib/utils';

/**
 * Types
 */

export interface AlbumRowProps {
  thumbnail: string;
  title: string;
  artist: string;
  duration?: string;
  isActive?: boolean;
  isAdded?: boolean;
  actionIcon?: ReactNode;
  onClick: () => void;
}

/**
 * AlbumRow
 */

export const AlbumRow: FunctionComponent<AlbumRowProps> = ({
  thumbnail,
  title,
  artist,
  duration,
  isActive = false,
  isAdded = false,
  actionIcon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
      isActive && 'bg-secondary',
      !isActive && 'hover:bg-secondary/50',
      isAdded && 'border-l-2 border-tertiary/40'
    )}
  >
    <img
      src={thumbnail}
      alt={title}
      className="size-10 shrink-0 rounded-none object-cover"
    />
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <Typography size="sm" className="truncate">
        {title}
      </Typography>
      <Typography size="xs" className="truncate">
        {artist}
      </Typography>
    </div>
    {actionIcon && (
      <span
        className={cn(
          'shrink-0',
          isAdded ? 'text-primary' : 'text-on-surface-variant'
        )}
      >
        {actionIcon}
      </span>
    )}
    {!actionIcon && duration && (
      <Typography size="xs" className="shrink-0">
        {duration}
      </Typography>
    )}
  </button>
);
