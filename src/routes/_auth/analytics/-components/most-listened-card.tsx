import type { FunctionComponent } from 'react';

import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import type { MostListenedAlbum } from '#/types/domain';

import { formatListeningTime } from '../-helpers/format-listening-time';

interface MostListenedCardProps {
  album: MostListenedAlbum | null;
  onViewAlbum: (id: string) => void;
}

export const MostListenedCard: FunctionComponent<MostListenedCardProps> = ({
  album,
  onViewAlbum,
}) => {
  if (!album) return null;

  return (
    <div className="rounded-sm bg-surface-container p-4">
      <Typography size="xs" transform="uppercase" tracking="wider" weight="medium">
        Most Listened
      </Typography>
      <div className="mt-3 flex gap-4">
        <div className="size-20 shrink-0 rounded-sm bg-surface-container-high" />
        <div className="flex flex-col justify-between">
          <div>
            <Typography family="heading" size="lg">
              {album.title}
            </Typography>
            <Typography size="sm" className="text-on-surface-variant">
              {album.artist}
            </Typography>
          </div>
          <div>
            <Typography size="sm">{album.sessionCount} listening sessions</Typography>
            <Typography size="sm">{formatListeningTime(album.totalDurationSeconds)} total</Typography>
          </div>
        </div>
      </div>
      <Button variant="text" className="mt-3" onClick={() => onViewAlbum(album.id)}>
        View album
      </Button>
    </div>
  );
};
