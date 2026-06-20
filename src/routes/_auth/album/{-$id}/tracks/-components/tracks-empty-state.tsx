import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface TracksEmptyStateProps {
  onAddClick: () => void;
}

/**
 * TracksEmptyState
 */

export const TracksEmptyState: FunctionComponent<TracksEmptyStateProps> = ({
  onAddClick,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 bg-surface-container-high py-8">
    <Typography
      family="heading"
      size="lg"
      className="text-center text-on-surface-variant"
    >
      No tracklist available
    </Typography>
    <Typography size="sm" className="text-center text-on-surface-variant">
      Add them manually using the button below.
    </Typography>
    <Button
      type="button"
      variant="ghost"
      onClick={onAddClick}
      className="mt-2 border border-outline-20 px-6"
    >
      <Typography
        size="xs"
        weight="bold"
        transform="uppercase"
        tracking="widest"
      >
        + ADD TRACKS
      </Typography>
    </Button>
  </div>
);
