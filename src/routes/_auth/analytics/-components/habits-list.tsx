import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { formatListeningTime } from '../-helpers/format-listening-time';

interface HabitsListProps {
  peakActivityDay: string;
  averageSessionSeconds: number;
  completionRate: number;
}

interface HabitRow {
  label: string;
  value: string;
  hint: string;
}

export const HabitsList: FunctionComponent<HabitsListProps> = ({
  peakActivityDay,
  averageSessionSeconds,
  completionRate,
}) => {
  const rows: HabitRow[] = [
    { label: 'Peak Activity',
value: peakActivityDay,
hint: '' },
    {
      label: 'Average Session',
      value: formatListeningTime(averageSessionSeconds),
      hint: '',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      hint: 'Full Albums',
    },
  ];

  return (
    <div className="rounded-sm bg-surface-container p-4">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
      >
        Habits
      </Typography>
      <div className="mt-3 space-y-3">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <Typography size="sm" className="text-on-surface-variant">
              {row.label}
            </Typography>
            <div className="text-right">
              <Typography weight="medium">{row.value}</Typography>
              {row.hint && (
                <Typography size="xs" className="text-on-surface-variant">
                  {row.hint}
                </Typography>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
