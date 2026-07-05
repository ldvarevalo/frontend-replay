import type { FunctionComponent } from 'react';
import { Check } from 'lucide-react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

export interface AlbumCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  year?: string;
  isListened?: boolean;
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
  isListened = false,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-start text-left transition-opacity hover:opacity-80"
  >
    <div className="relative mb-4 w-full overflow-hidden bg-muted">
      <div className="aspect-square">
        <img
          src={coverUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      {isListened && (
        <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-tertiary/20 text-[10px] text-tertiary">
          <Check className="size-3" />
        </span>
      )}
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
