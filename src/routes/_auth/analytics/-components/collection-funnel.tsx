import type { FunctionComponent } from 'react';

import { Typography } from '#/components/ui/typography';

interface CollectionFunnelProps {
  discover: number;
  listened: number;
  want: number;
  owned: number;
  totalEntered: number;
}

interface Stage {
  label: string;
  count: number;
}

export const CollectionFunnel: FunctionComponent<CollectionFunnelProps> = ({
  discover,
  listened,
  want,
  owned,
  totalEntered,
}) => {
  const stages: Stage[] = [
    { label: 'Discover',
count: discover },
    { label: 'Listened',
count: listened },
    { label: 'Want',
count: want },
    { label: 'Owned',
count: owned },
  ];

  return (
    <div className="rounded-sm bg-surface-container p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="text-center">
                <Typography family="heading" size="lg">
                  {stage.count}
                </Typography>
                <Typography size="xs" transform="uppercase" tracking="wider">
                  {stage.label}
                </Typography>
              </div>
              {i < stages.length - 1 && (
                <Typography size="sm" className="text-muted-foreground">
                  →
                </Typography>
              )}
            </div>
          ))}
        </div>
      </div>
      <Typography size="sm" className="mt-3 text-on-surface-variant">
        Your path to a curated collection. {totalEntered} albums entered your
        collection journey this month.
      </Typography>
    </div>
  );
};
