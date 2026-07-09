import type { FunctionComponent } from 'react';
import {
  CheckCircle2,
  Clock,
  Disc3,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { Typography } from '#/components/ui/typography';
import { formatListeningTime } from '../-helpers/format-listening-time';

/**
 * Types
 */

interface MetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

interface MetricCardsProps {
  listenedAlbums: number;
  listeningTimeSeconds: number;
  addedToWant: number;
  markedOwned: number;
}

/**
 * MetricCard
 */

const MetricCard: FunctionComponent<MetricCardProps> = ({
  icon: Icon,
  value,
  label,
}) => (
  <div className="flex min-h-30 flex-col items-center justify-around rounded-sm bg-surface-container-lowest p-4">
    <Icon className="size-5 text-tertiary mb-6" />
    <Typography
      as="span"
      family="heading"
      size="md"
      weight="bold"
      className="mb-1 text-center text-nowrap"
    >
      {value}
    </Typography>
    <Typography
      size="2xs"
      tracking="tight"
      weight="medium"
      className="text-center"
    >
      {label}
    </Typography>
  </div>
);

/**
 * MetricCards
 */

export const MetricCards: FunctionComponent<MetricCardsProps> = ({
  listenedAlbums,
  listeningTimeSeconds,
  addedToWant,
  markedOwned,
}) => {
  const formattedListeningTime = formatListeningTime(listeningTimeSeconds);

  return (
    <div className="grid grid-cols-4 gap-1">
      <MetricCard icon={Disc3} value={listenedAlbums} label="Albums listened" />
      <MetricCard
        icon={Clock}
        value={formattedListeningTime}
        label="Listening time"
      />
      <MetricCard icon={Heart} value={addedToWant} label="Added to Want" />
      <MetricCard
        icon={CheckCircle2}
        value={markedOwned}
        label="Marked Owned"
      />
    </div>
  );
};
