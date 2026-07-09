import type { FunctionComponent } from 'react';
import { ChevronRight } from 'lucide-react';

import { Button } from '#/components/ui/button';
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
  <div className="flex flex-col items-start rounded-md bg-surface-container border-surface-container-high border gap-4 p-4">
    <div className="flex items-end gap-4 max-w-full min-w-0">
      {oldestEntry && (
        <img
          src={oldestEntry.coverUrl}
          alt=""
          aria-hidden
          className="size-36 shrink-0 rounded-sm object-cover"
        />
      )}

      <div className="flex flex-col min-w-0">
        <Typography
          as="span"
          family="heading"
          size="2xl"
          weight="bold"
          className="text-primary-container"
        >
          {count}
        </Typography>
        <Typography size="sm" className="text-on-surface-variant">
          albums waiting
        </Typography>

        {oldestEntry && (
          <div className="mt-4">
            <Typography
              size="2xs"
              tracking="wider"
              weight="medium"
              className="text-on-surface-variant"
              uppercase
            >
              Oldest waiting
            </Typography>
            <Typography size="sm" weight="medium" className="truncate">
              {oldestEntry.title}
            </Typography>
            <Typography
              size="sm"
              className="shrink-0 text-on-surface-variant"
              as="span"
            >
              {oldestEntry.daysSinceAdded} days ago
            </Typography>
          </div>
        )}
      </div>
    </div>

    <Button variant="ghost" className="shrink-0" onClick={onNavigateToDiscover}>
      Continue discovering
      <ChevronRight />
    </Button>
  </div>
);
