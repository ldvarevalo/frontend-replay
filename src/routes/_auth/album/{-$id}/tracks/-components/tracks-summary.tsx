import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { formatDuration } from '#/core/helpers/format-duration';

/**
 * Types
 */

interface TracksSummaryProps {
  totalCount: number;
  totalDurationSeconds: number;
}

/**
 * TracksSummary
 */

export const TracksSummary: FunctionComponent<TracksSummaryProps> = ({
  totalCount,
  totalDurationSeconds,
}) => {
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="bg-surface-container-high px-4 py-3">
      <Typography
        size="sm"
        weight="bold"
        transform="uppercase"
        tracking="widest"
        className="text-on-surface"
      >
        {totalCount} tracks · {formatDuration(totalDurationSeconds)}
      </Typography>
    </div>
  );
};
