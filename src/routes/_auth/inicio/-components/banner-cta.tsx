import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface BannerCtaProps {
  count: number;
  onClick: () => void;
}

/**
 * BannerCta
 */

export const BannerCta: FunctionComponent<BannerCtaProps> = ({
  count,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="soul-gradient flex w-full items-center justify-between rounded-sm px-5 py-4 text-left transition-opacity hover:opacity-90"
  >
    <div className="flex flex-col gap-1">
      <Typography
        size="xs"
        transform="uppercase"
        tracking="wider"
        weight="medium"
        className="text-on-primary-container"
      >
        WANT TO LISTEN
      </Typography>
      <Typography
        family="heading"
        size="xl"
        className="text-on-primary-container"
      >
        {count} items waiting
      </Typography>
    </div>
    <span className="text-xl text-on-primary-container">&rarr;</span>
  </button>
);
