import type { FunctionComponent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';

/**
 * AlbumRating
 */

export const AlbumRating: FunctionComponent = () => (
  <section className="space-y-2">
    <Typography
      size="xs"
      transform="uppercase"
      className="text-on-surface-variant"
    >
      YOUR RATING
    </Typography>

    <Button variant="outline" size="lg">
      <Plus className="size-5 text-on-surface" />
      <Typography size="xs" transform="uppercase" className="text-on-surface">
        ADD RATING
      </Typography>
    </Button>
  </section>
);
