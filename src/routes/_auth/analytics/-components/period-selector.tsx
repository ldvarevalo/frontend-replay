import type { FunctionComponent } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { Period } from '../-helpers/get-period-dates';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  {
    value: 'this-month',
    label: 'This Month',
  },
  {
    value: 'last-month',
    label: 'Last Month',
  },
  {
    value: 'this-year',
    label: 'This Year',
  },
  {
    value: 'all-time',
    label: 'All Time',
  },
];

export const PeriodSelector: FunctionComponent<PeriodSelectorProps> = ({
  value,
  onChange,
}) => {
  const currentLabel = PERIODS.find(period => period.value === value)?.label ?? value;

  return (
    <Select
      value={value}
      onValueChange={next => {
        if (next) {
          onChange(next);
        }
      }}
    >
      <SelectTrigger className="h-10 w-40 px-3">
        <SelectValue>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {PERIODS.map(({ value: periodValue, label }) => (
          <SelectItem key={periodValue} value={periodValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
