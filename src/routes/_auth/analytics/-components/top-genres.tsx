import type { FunctionComponent } from 'react';

import { Typography } from '#/components/ui/typography';

interface TopGenresProps {
  genres: string[];
}

const MAX_VISIBLE = 6;

export const TopGenres: FunctionComponent<TopGenresProps> = ({ genres }) => {
  if (genres.length === 0) {
    return null;
  }

  return (
    <div>
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        Top Genres
      </Typography>
      <div className="mt-2 flex flex-wrap gap-2">
        {genres.slice(0, MAX_VISIBLE).map(name => (
          <span
            key={name}
            className="rounded-full bg-surface-container-high px-3 py-1"
          >
            <Typography size="sm">{name}</Typography>
          </span>
        ))}
      </div>
    </div>
  );
};
