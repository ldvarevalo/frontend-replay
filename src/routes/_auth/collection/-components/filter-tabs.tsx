import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { cn } from '#/lib/utils';

/**
 * Types
 */

interface Tab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * FilterTabs
 */

export const FilterTabs: FunctionComponent<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => (
  <div className="flex gap-3 pb-6 overflow-x-auto hide-scrollbar">
    {tabs.map(tab => (
      <button
        key={tab.id}
        type="button"
        onClick={() => onTabChange(tab.id)}
        className={cn(
          'shrink-0 px-5 py-2',
          activeTab === tab.id
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container-high text-on-surface-variant'
        )}
      >
        <Typography
          className={cn(
            activeTab === tab.id
              ? 'text-on-primary-container'
              : 'text-on-surface-variant'
          )}
          size="xs"
          tracking="widest"
          weight="medium"
          transform="uppercase"
        >
          {tab.label}
        </Typography>
      </button>
    ))}
  </div>
);
