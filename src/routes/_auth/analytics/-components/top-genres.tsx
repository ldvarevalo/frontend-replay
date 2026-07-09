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
      <Typography size="xs" tracking="wider" weight="medium" uppercase>
        Top Genres
      </Typography>
      <div className="mt-3 flex flex-wrap gap-2">
        {genres.slice(0, MAX_VISIBLE).map((name, idx) => (
          <span
            key={name}
            className={`rounded-full px-3 py-1 ${
              idx === 0
                ? 'bg-tertiary-container text-tertiary'
                : 'bg-surface-container-high text-primary'
            }`}
          >
            <Typography size="sm">{name}</Typography>
          </span>
        ))}
      </div>
    </div>
  );
};
