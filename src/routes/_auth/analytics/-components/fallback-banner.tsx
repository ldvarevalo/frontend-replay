import type { FunctionComponent } from 'react';
import { Info } from 'lucide-react';
import type { Period } from '../-helpers/get-period-dates';

const PERIOD_LABELS: Record<Period, string> = {
  'this-month': 'This Month',
  'last-month': 'Last Month',
  'this-year': 'This Year',
  'all-time': 'All Time',
};

interface FallbackBannerProps {
  period: Period;
}

export const FallbackBanner: FunctionComponent<FallbackBannerProps> = ({
  period,
}) => (
  <div className="flex items-center gap-2 rounded-sm bg-surface-container p-3">
    <Info className="size-4 shrink-0 text-on-surface-variant" />
    <p className="text-sm text-on-surface-variant">
      No listening data this month. Showing data from {PERIOD_LABELS[period]}.
    </p>
  </div>
);
