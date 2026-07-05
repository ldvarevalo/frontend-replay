import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { cn } from '#/lib/utils';

/**
 * Types
 */

interface OptionGroupProps {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
}

/**
 * OptionGroup
 */

export const OptionGroup: FunctionComponent<OptionGroupProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <section className="space-y-2">
    <Typography
      size="xs"
      transform="uppercase"
      className="text-on-surface-variant"
    >
      {label}
    </Typography>
    <div className="flex w-full">
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'flex-1 px-5 py-2',
            value === option
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
              value === option
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
