import type { FunctionComponent } from 'react';
import { Calendar, CheckCircle2, Clock, type LucideIcon } from 'lucide-react';
import { Typography } from '#/components/ui/typography';
import { formatListeningTime } from '../-helpers/format-listening-time';

/**
 * Types
 */

interface HabitsListProps {
  peakActivityDay: string;
  averageSessionSeconds: number;
  completionRate: number;
}

interface HabitRowData {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  showProgress?: boolean;
}

/**
 * HabitsList
 */

export const HabitsList: FunctionComponent<HabitsListProps> = ({
  peakActivityDay,
  averageSessionSeconds,
  completionRate,
}) => {
  const rows: HabitRowData[] = [
    {
      icon: Calendar,
      label: 'Peak Activity',
      value: peakActivityDay,
    },
    {
      icon: Clock,
      label: 'Average Session',
      value: formatListeningTime(averageSessionSeconds),
    },
    {
      icon: CheckCircle2,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      hint: 'Full Albums',
      showProgress: true,
    },
  ];

  return (
    <div className="rounded-sm bg-surface-container p-4">
      <Typography size="xs" tracking="wider" weight="medium" uppercase>
        Habits
      </Typography>
      <div className="flex gap-3 mt-3">
        <div className="w-0.5 shrink-0 rounded-full bg-primary-container" />
        <div className="min-w-0 flex-1 space-y-6 py-2">
          {rows.map(row => (
            <div key={row.label}>
              <div className="flex items-center gap-3">
                <row.icon className="size-4 shrink-0 text-primary-container" />
                <Typography
                  size="sm"
                  className="flex-1 text-on-surface-variant"
                >
                  {row.label}
                </Typography>
                <div className="text-right">
                  <Typography weight="medium">
                    {row.value}
                    {row.hint && (
                      <Typography
                        as="span"
                        size="xs"
                        className="ml-1 text-on-surface-variant"
                        weight="normal"
                      >
                        {row.hint}
                      </Typography>
                    )}
                  </Typography>
                </div>
              </div>
              {row.showProgress && (
                <div className="mt-4 ml-7 h-1.5 w-full rounded-full bg-primary-container/30">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
