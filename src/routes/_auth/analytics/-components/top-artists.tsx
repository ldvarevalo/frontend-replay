import type { FunctionComponent } from 'react';

import { Typography } from '#/components/ui/typography';

interface TopArtistsProps {
  artists: string[];
}

const MAX_VISIBLE = 4;

export const TopArtists: FunctionComponent<TopArtistsProps> = ({ artists }) => {
  if (artists.length === 0) {
    return null;
  }

  const visible = artists.slice(0, MAX_VISIBLE);
  const overflow = artists.length - MAX_VISIBLE;

  return (
    <div>
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        Top Artists
      </Typography>
      <div className="mt-2 space-y-1">
        {visible.map(name => (
          <Typography key={name} size="sm">
            {name}
          </Typography>
        ))}
        {overflow > 0 && (
          <Typography size="sm" className="text-on-surface-variant">
            +{overflow}
          </Typography>
        )}
      </div>
    </div>
  );
};
