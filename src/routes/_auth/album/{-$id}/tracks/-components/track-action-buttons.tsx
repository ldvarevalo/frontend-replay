import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface TrackActionButtonsProps {
  isValid: boolean;
  isPending: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * TrackActionButtons
 */

export const TrackActionButtons: FunctionComponent<TrackActionButtonsProps> = ({
  isValid,
  isPending,
  onSubmit,
  onCancel,
}) => (
  <div className="flex flex-col gap-3 px-4 pb-8">
    <Button
      type="button"
      variant="primary"
      size="lg"
      disabled={!isValid || isPending}
      onClick={onSubmit}
    >
      <Typography
        size="sm"
        weight="bold"
        transform="uppercase"
        tracking="widest"
        className="text-on-primary-container"
      >
        {isPending ? 'SAVING...' : 'SAVE'}
      </Typography>
    </Button>

    <Button
      type="button"
      variant="text"
      size="lg"
      onClick={onCancel}
    >
      <Typography
        size="sm"
        weight="bold"
        transform="uppercase"
        tracking="widest"
        className="text-on-surface-variant"
      >
        CANCEL
      </Typography>
    </Button>
  </div>
);
