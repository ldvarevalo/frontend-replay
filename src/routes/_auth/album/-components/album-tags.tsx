import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface AlbumTagsProps {
  year: string;
  genre: string;
}

/**
 * AlbumTags
 */

export const AlbumTags: FunctionComponent<AlbumTagsProps> = ({
  year,
  genre,
}) => (
  <div className="flex flex-col items-start gap-1">
    {year && (
      <div className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1">
        <Typography
          size="xs"
          transform="uppercase"
          className="text-on-surface-variant"
        >
          YEAR{' '}
        </Typography>
        <Typography
          size="xs"
          transform="uppercase"
          weight="bold"
          className="text-tertiary"
        >
          {year}
        </Typography>
      </div>
    )}
    {genre && (
      <div className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1">
        <Typography
          size="xs"
          transform="uppercase"
          className="text-on-surface-variant"
        >
          GENRE{' '}
        </Typography>
        <Typography
          size="xs"
          transform="uppercase"
          weight="bold"
          className="text-tertiary"
        >
          {genre}
        </Typography>
      </div>
    )}
  </div>
);
