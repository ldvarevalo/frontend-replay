import type { FunctionComponent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { Button } from '#/components/ui/button';
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

/**
 * Constants
 */

const OPTIONS: PriorityLevel[] = ['low', 'medium', 'high'];

/**
 * WishlistInfo
 */

const WishlistInfo: FunctionComponent<{ addedAt: string | null }> = ({
  addedAt,
}) => {
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
      <Typography size="sm" className="text-on-surface-variant">
        Added {formatDate(addedAt)}
      </Typography>
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

    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="flex w-full items-center justify-center gap-2 border border-outline-20 py-6"
          >
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
          <Button variant="outline" onClick={onMarkAsOwned}>
            Mark as Owned
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);
