import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { cn } from '#/lib/utils';
import type { CollectionStatus } from '#/types/domain';

/**
 * Types
 */

interface CollectionStatusSelectorProps {
  status: CollectionStatus | null;
  onChange: (status: CollectionStatus) => void;
}

/**
 * Constants
 */

const OPTIONS: CollectionStatus[] = ['owned', 'want', 'listened'];

/**
 * CollectionStatusSelector
 */

export const CollectionStatusSelector: FunctionComponent<
  CollectionStatusSelectorProps
> = ({ status, onChange }) => (
  <section className="space-y-2">
    <Typography
      size="xs"
      transform="uppercase"
      className="text-on-surface-variant"
    >
      COLLECTION STATUS
    </Typography>
    <div className="flex w-full">
      {OPTIONS.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'flex-1 px-5 py-2',
            status === option
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface-container-high text-on-surface-variant'
          )}
        >
          <Typography
            size="xs"
            tracking="widest"
            weight="medium"
            transform="uppercase"
            className={cn(
              status === option
                ? 'text-on-primary-container'
                : 'text-on-surface-variant'
            )}
          >
            {option}
          </Typography>
        </button>
      ))}
    </div>
  </section>
);
