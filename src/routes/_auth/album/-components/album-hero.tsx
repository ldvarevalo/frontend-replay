import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface AlbumHeroProps {
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
  <div className="relative w-full">
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
      <Typography family="heading" size="md" className="text-primary">
        {artist}
      </Typography>
    </div>
  </div>
);
