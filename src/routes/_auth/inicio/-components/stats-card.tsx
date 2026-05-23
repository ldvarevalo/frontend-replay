import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface StatsCardProps {
  totalReleases: number;
  thisMonth: number;
}

/**
 * StatsCard
 */

export const StatsCard: FunctionComponent<StatsCardProps> = ({
  totalReleases,
  thisMonth,
}) => (
  <div className="grid grid-cols-2 gap-4 rounded-sm bg-secondary p-4">
    <div className="flex flex-col gap-1">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        TOTAL RELEASES
      </Typography>
      <Typography family="heading" size="2xl">
        {totalReleases.toLocaleString()}
      </Typography>
    </div>
    <div className="flex flex-col gap-1">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        THIS MONTH
      </Typography>
      <Typography family="heading" size="2xl">
        {thisMonth}
      </Typography>
    </div>
  </div>
);
