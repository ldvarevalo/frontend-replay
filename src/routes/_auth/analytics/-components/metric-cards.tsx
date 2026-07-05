import type { FunctionComponent } from 'react';

import { Typography } from '#/components/ui/typography';

import { formatListeningTime } from '../-helpers/format-listening-time';

interface MetricCardsProps {
  listenedAlbums: number;
  listeningTimeSeconds: number;
  addedToWant: number;
  markedOwned: number;
}

interface MetricCardProps {
  value: string | number;
  label: string;
}

const MetricCard: FunctionComponent<MetricCardProps> = ({ value, label }) => (
  <div className="rounded-sm bg-surface-container p-4">
    <Typography family="heading" size="2xl">
      {value}
    </Typography>
    <Typography size="xs" transform="uppercase" tracking="wider" weight="medium">
      {label}
    </Typography>
  </div>
);

export const MetricCards: FunctionComponent<MetricCardsProps> = ({
  listenedAlbums,
  listeningTimeSeconds,
  addedToWant,
  markedOwned,
}) => (
  <div className="grid grid-cols-2 gap-3">
    <MetricCard value={listenedAlbums} label="Albums listened" />
    <MetricCard value={formatListeningTime(listeningTimeSeconds)} label="Listening time" />
    <MetricCard value={addedToWant} label="Added to Want" />
    <MetricCard value={markedOwned} label="Marked Owned" />
  </div>
);
