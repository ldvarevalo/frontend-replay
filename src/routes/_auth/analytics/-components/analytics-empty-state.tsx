import type { FunctionComponent } from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

interface AnalyticsEmptyStateProps {
  onLogFirstSession: () => void;
}

export const AnalyticsEmptyState: FunctionComponent<
  AnalyticsEmptyStateProps
> = ({ onLogFirstSession }) => (
  <div className="flex flex-col items-center gap-4 py-16">
    <BarChart3 className="size-12 text-on-surface-variant" />
    <Typography family="heading" size="lg" className="text-center">
      No listening data yet
    </Typography>
    <Typography
      size="sm"
      className="max-w-xs text-center text-on-surface-variant"
    >
      Start logging listening sessions to unlock your personal insights.
    </Typography>
    <Button onClick={onLogFirstSession}>Log your first session</Button>
  </div>
);
