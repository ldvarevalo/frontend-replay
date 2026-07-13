import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface StatsCardProps {
  collectionCount: number;
  listeningHours: number;
}

/**
 * StatsCard
 */

export const StatsCard: FunctionComponent<StatsCardProps> = ({
  collectionCount,
  listeningHours,
}) => (
  <div className="grid grid-cols-2 gap-4 rounded-sm bg-secondary p-4">
    <div className="flex flex-col gap-1">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        Collection
      </Typography>
      <Typography as="h6" family="heading" size="xl">
        {collectionCount.toLocaleString()} albums
      </Typography>
    </div>
    <div className="flex flex-col gap-1">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        This month
      </Typography>
      <Typography as="h6" family="heading" size="xl">
        {listeningHours}h listening
      </Typography>
    </div>
  </div>
);
