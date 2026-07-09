import type { FunctionComponent } from 'react';
import { ChevronRight, Clock, Headphones, type LucideIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import { useDominantColor } from '#/core/hooks/use-dominant-color';
import { cn } from '#/lib/utils';
import type { MostListenedAlbum } from '#/types/domain';

import { formatListeningTime } from '../-helpers/format-listening-time';

/**
 * Types
 */

interface AlbumHeroCardProps {
  album: MostListenedAlbum;
  onViewAlbum: (id: string) => void;
}

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
  txtColor?: string;
}

/**
 * Components
 */

const StatItem: FunctionComponent<StatItemProps> = ({
  icon: Icon,
  value,
  label,
  txtColor = 'text-on-primary-container/70',
}) => (
  <span className="inline-flex items-start gap-1">
    <Icon className={`size-3.5 ${txtColor}`} />
    <div className="flex flex-col">
      <Typography
        as="span"
        family="heading"
        size="sm"
        weight="bold"
        className={cn(txtColor, 'text-nowrap')}
      >
        {value}
      </Typography>
      <Typography size="2xs" className={txtColor}>
        {label}
      </Typography>
    </div>
  </span>
);

/**
 * AlbumHeroCard
 */

export const AlbumHeroCard: FunctionComponent<AlbumHeroCardProps> = ({
  album,
  onViewAlbum,
}) => {
  const { hex: dominantHex, isLight } = useDominantColor(album.coverUrl);
  const txt70 = `text-${isLight ? 'surface/70' : 'on-primary-container/70'}`;

  return (
    <div
      className="overflow-hidden rounded-sm flex flex-col items-start gap-4 px-6 pt-6 pb-4 w-full"
      style={
        dominantHex
          ? {
              background: `linear-gradient(135deg, ${dominantHex}, ${isLight ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'})`,
            }
          : undefined
      }
    >
      <Typography
        size="2xs"
        tracking="wider"
        weight="medium"
        uppercase
        className={cn(
          isLight ? 'text-surface/90' : 'text-on-primary-container/90',
          'mb-2'
        )}
      >
        MOST LISTENED ALBUM
      </Typography>
      <div className="flex justify-between gap-4 w-full">
        <div>
          <div>
            <Typography
              family="heading"
              size="md"
              weight="bold"
              className={cn(
                isLight ? 'text-surface' : 'text-on-primary-container',
                'max-w-full'
              )}
            >
              {album.title}
            </Typography>
            <Typography
              size="xs"
              className={cn(
                isLight ? 'text-surface/80' : 'text-on-primary-container/80',
                'max-w-full'
              )}
            >
              {album.artist}
            </Typography>
          </div>

          <div className="flex gap-4 mt-8">
            <StatItem
              icon={Headphones}
              value={String(album.sessionCount)}
              label="sessions"
              txtColor={txt70}
            />
            <span className="w-px h-10 bg-surface/10" />
            <StatItem
              icon={Clock}
              value={formatListeningTime(album.totalDurationSeconds)}
              label="total time"
              txtColor={txt70}
            />
          </div>
        </div>
        <img
          src={album.coverUrl}
          alt={`Cover for ${album.title}`}
          className="size-32 object-cover rounded-md"
        />
      </div>
      <Button
        variant="ghost"
        theme={isLight ? 'light' : 'dark'}
        onClick={() => onViewAlbum(album.id)}
      >
        View album
        <ChevronRight />
      </Button>
    </div>
  );
};
