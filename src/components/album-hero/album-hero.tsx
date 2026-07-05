import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

export interface AlbumHeroProps {
  coverUrl: string;
  title: string;
  artist: string;
}

/**
 * AlbumHero
 */

export const AlbumHero: FunctionComponent<AlbumHeroProps> = ({
  coverUrl,
  title,
  artist,
}) => (
  <div className="w-full relative">
    <div className="aspect-[4/3] w-full overflow-hidden">
      <img
        src={coverUrl}
        alt={title}
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 space-y-1 p-4">
      <Typography size="2xl" weight="bold" className="font-heading not-italic">
        {title}
      </Typography>
      <Typography
        variant="title"
        size="sm"
        className="text-secondary-brand mb-4"
      >
        {artist}
      </Typography>
    </div>
  </div>
);
