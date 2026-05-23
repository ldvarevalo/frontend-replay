import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

export interface AlbumCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  year?: string;
  onClick: () => void;
}

/**
 * AlbumCard
 */

export const AlbumCard: FunctionComponent<AlbumCardProps> = ({
  coverUrl,
  title,
  artist,
  year,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-start text-left transition-opacity hover:opacity-80"
  >
    <div className="aspect-square mb-4 w-full overflow-hidden bg-muted">
      <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
    </div>
    <Typography
      className="text-on-surface"
      as="h3"
      family="heading"
      size="md"
      weight="semibold"
    >
      {title}
    </Typography>
    <Typography
      className="text-on-surface-variant"
      size="xs"
      tracking="widest"
      uppercase
    >
      {artist}
    </Typography>
    {year && (
      <Typography className="text-on-surface-variant" size="2xs">
        {year}
      </Typography>
    )}
  </button>
);
