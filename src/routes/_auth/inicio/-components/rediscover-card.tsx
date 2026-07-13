import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';

export interface RediscoverCardProps {
  coverUrl: string;
  title: string;
  artist: string;
  onClick: () => void;
}

export const RediscoverCard: FunctionComponent<RediscoverCardProps> = ({
  coverUrl,
  title,
  artist,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full overflow-hidden rounded-sm border border-outline-variant bg-surface-container-low text-left transition-opacity hover:opacity-80"
  >
    <div className="aspect-[3/1] w-full overflow-hidden bg-muted sm:aspect-[4/1]">
      <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
    </div>
    <div className="p-3">
      <Typography family="heading" size="md" weight="semibold">
        {title}
      </Typography>
      <Typography size="sm" className="text-on-surface-variant">
        {artist}
      </Typography>
    </div>
  </button>
);
