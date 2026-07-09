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
      <Typography size="xs" tracking="wider" weight="medium" uppercase>
        Top Artists
      </Typography>
      <ol className="mt-3 space-y-2">
        {visible.map((name, idx) => (
          <li key={name} className="flex items-center gap-2">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-[10px] font-medium text-on-surface-variant">
              {idx + 1}
            </span>
            <Typography size="sm">{name}</Typography>
          </li>
        ))}
        {overflow > 0 && (
          <li className="pl-7 text-sm text-on-surface-variant">
            +{overflow} more
          </li>
        )}
      </ol>
    </div>
  );
};
