import type { FunctionComponent } from 'react';
import { Play } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

/**
 * AlbumListeningHistory
 */

export const AlbumListeningHistory: FunctionComponent = () => (
  <section className="space-y-2">
    <div className="flex items-center justify-between">
      <Typography
        size="xs"
        transform="uppercase"
        className="text-on-surface-variant"
      >
        LISTENING HISTORY
      </Typography>
      <Button
        variant="ghost"
        className="flex items-center gap-1 border border-outline-20"
      >
        <Play className="size-3" />
        <Typography size="xs" transform="uppercase">
          NEW SESSION
        </Typography>
      </Button>
    </div>
    <div className="flex items-center justify-center bg-surface-container-high py-8">
      <Typography
        family="heading"
        size="md"
        className="text-center text-on-surface-variant"
      >
        No sessions recorded yet. Start your first spin of this record.
      </Typography>
    </div>
  </section>
);
