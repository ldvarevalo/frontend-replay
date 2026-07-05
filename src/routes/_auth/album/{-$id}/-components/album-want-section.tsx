import type { FunctionComponent } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { Typography } from '#/components/ui/typography';
import { formatDate } from '#/core/helpers/format-date';
import type { PriorityLevel } from '#/types/domain';
import { OptionGroup } from '../../-components/option-group';

/**
 * Types
 */

interface AlbumWantSectionProps {
  addedAt: string | null;
  priority: PriorityLevel | null;
  onPriorityChange: (priority: PriorityLevel) => void;
  onMarkAsOwned: () => void;
}

interface WishlistInfoProps {
  addedAt: string | null;
}

/**
 * Constants
 */

const OPTIONS: PriorityLevel[] = ['low', 'medium', 'high'];

/**
 * WishlistInfo
 */

const WishlistInfo: FunctionComponent<WishlistInfoProps> = ({ addedAt }) => {
  if (!addedAt) {
    return null;
  }

  return (
    <section className="space-y-2">
      <Typography
        size="xs"
        transform="uppercase"
        className="text-on-surface-variant"
      >
        WISHLIST
      </Typography>
      <div className="flex items-center gap-3 bg-surface-container-high px-4 py-3">
        <Calendar className="size-5 text-tertiary" />
        <div className="flex flex-col">
          <Typography size="xs" className="text-on-surface-variant">
            Added
          </Typography>
          <Typography family="heading" size="lg" className="text-tertiary">
            {formatDate(addedAt)}
          </Typography>
        </div>
      </div>
    </section>
  );
};

/**
 * AlbumWantSection
 */

export const AlbumWantSection: FunctionComponent<AlbumWantSectionProps> = ({
  addedAt,
  priority,
  onPriorityChange,
  onMarkAsOwned,
}) => (
  <>
    <WishlistInfo addedAt={addedAt} />

    <OptionGroup
      label="PURCHASE PRIORITY"
      options={OPTIONS}
      value={priority}
      onChange={value => onPriorityChange(value as PriorityLevel)}
    />

    <div className="h-px bg-outline/20 my-8" />

    <section className="space-y-2">
      <Typography
        size="xs"
        className="text-center text-on-surface-variant mb-4"
      >
        Ready to move it to your collection?
      </Typography>
      <Dialog>
        <DialogTrigger
          render={
            <Button variant="primary" className="w-full">
              <Typography size="xs" transform="uppercase">
                MARK AS OWNED
              </Typography>
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You already own this album?</DialogTitle>
            <DialogDescription>
              This will move it from wishlist to your collection as
              &ldquo;owned&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="primary" onClick={onMarkAsOwned}>
              Mark as Owned
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  </>
);
