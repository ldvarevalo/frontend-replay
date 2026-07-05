import type { FunctionComponent } from 'react';

import { Typography } from '#/components/ui/typography';
import type { BacklogEntry } from '#/types/domain';

interface DiscoverBacklogCardProps {
  count: number;
  oldestEntry?: BacklogEntry;
  onNavigateToDiscover: () => void;
}

export const DiscoverBacklogCard: FunctionComponent<
  DiscoverBacklogCardProps
> = ({ count, oldestEntry, onNavigateToDiscover }) => (
  <div
    className="cursor-pointer rounded-sm bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
    onClick={onNavigateToDiscover}
    role="button"
    tabIndex={0}
  >
    <Typography family="heading" size="2xl">
      {count}
    </Typography>
    <Typography size="sm" className="text-on-surface-variant">
      albums waiting to be discovered
    </Typography>

    {oldestEntry && (
      <div className="mt-3 border-t border-outline-variant pt-3">
        <Typography
          size="xs"
          transform="uppercase"
          tracking="wider"
          weight="medium"
        >
          Oldest entry
        </Typography>
        <div className="mt-2 flex items-center gap-3">
          <div className="size-10 rounded-sm bg-surface-container-high" />
          <div>
            <Typography weight="medium">{oldestEntry.title}</Typography>
            <Typography size="sm" className="text-on-surface-variant">
              {oldestEntry.artist}
            </Typography>
            <Typography size="xs" className="text-on-surface-variant">
              Added {oldestEntry.daysSinceAdded} days ago
            </Typography>
          </div>
        </div>
      </div>
    )}
  </div>
);
