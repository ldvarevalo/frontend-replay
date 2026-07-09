import type { FunctionComponent } from 'react';
import { Calendar } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import type { Period } from '../-helpers/get-period-dates';

interface PeriodOption {
  value: Period;
  label: string;
}

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const PERIODS: PeriodOption[] = [
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
}) => (
  <Select
    value={value}
    onValueChange={next => {
      if (next) {
        onChange(next);
      }
    }}
  >
    <SelectTrigger
      className="h-10 w-20 px-3"
      aria-label={`Select period, current: ${PERIODS.find(p => p.value === value)?.label ?? value}`}
    >
      <Calendar className="h-4 w-4" />
      <SelectValue className="sr-only" />
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
