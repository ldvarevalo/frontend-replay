import type { FunctionComponent } from 'react';

const Bar: FunctionComponent<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-sm bg-surface-container-high ${className}`} />
);

export const AnalyticsSkeleton: FunctionComponent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <Bar key={i} className="h-20" />
      ))}
    </div>
    <Bar className="h-24" />
    <Bar className="h-40" />
    <div className="flex gap-4">
      <Bar className="h-32 flex-1" />
      <Bar className="h-32 flex-1" />
    </div>
    <Bar className="h-24" />
  </div>
);
