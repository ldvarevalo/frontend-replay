import type { FunctionComponent } from 'react';

import type { Period } from '../-helpers/get-period-dates';

import { cn } from '#/lib/utils';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'all-time', label: 'All Time' },
];

export const PeriodSelector: FunctionComponent<PeriodSelectorProps> = ({
  value,
  onChange,
}) => (
  <div className="flex gap-1">
    {PERIODS.map(({ value: periodValue, label }) => (
      <button
        key={periodValue}
        onClick={() => onChange(periodValue)}
        className={cn(
          'rounded-sm px-3 py-1.5 text-xs font-medium transition-colors',
          value === periodValue
            ? 'bg-primary text-on-primary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        )}
      >
        {label}
      </button>
    ))}
  </div>
);
