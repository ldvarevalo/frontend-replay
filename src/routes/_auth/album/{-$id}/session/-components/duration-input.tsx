import { type ChangeEvent, type FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * DurationInput
 */

export const DurationInput: FunctionComponent<DurationInputProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    const formatted = raw.replace(
      /^(\d{0,2})(\d{0,2})(\d{0,2})$/,
      (_, ...parts) => parts.filter(Boolean).join(':')
    );
    onChange(formatted);
  };

  return (
    <div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder="00:43:57"
        className="w-full border-b-2 border-primary bg-transparent py-2 text-center font-mono text-4xl text-foreground outline-none placeholder:text-on-surface-variant/50"
      />
      <Typography
        size="xs"
        weight="bold"
        transform="uppercase"
        tracking="widest"
        className="mt-1 text-center text-on-surface-variant"
      >
        Optional: HH:MM:SS
      </Typography>
    </div>
  );
};
