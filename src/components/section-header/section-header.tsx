import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

/**
 * Types
 */

interface SectionHeaderProps {
  title: string;
  onLinkClick?: () => void;
  linkLabel?: string;
}

/**
 * SectionHeader
 */

export const SectionHeader: FunctionComponent<SectionHeaderProps> = ({
  title,
  onLinkClick,
  linkLabel = 'VIEW ALL',
}) => (
  <div className="flex items-center justify-between">
    <Typography as="h3" family="heading" size="lg">
      {title}
    </Typography>
    {onLinkClick && (
      <Button variant="text" onClick={onLinkClick}>
        {linkLabel}
      </Button>
    )}
  </div>
);
