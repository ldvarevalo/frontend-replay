import type { FunctionComponent } from 'react';
import { Calendar, Compass, Star, X } from 'lucide-react';
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

/**
 * Types
 */

interface AlbumDiscoverSectionProps {
  addedAt: string | null;
  archivedAt: string | null;
  onAddToWishlist: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
}

/**
 * AlbumDiscoverSection
 */

export const AlbumDiscoverSection: FunctionComponent<
  AlbumDiscoverSectionProps
> = ({ addedAt, archivedAt, onAddToWishlist, onArchive, onUnarchive }) => (
  <>
    {addedAt && (
      <section className="space-y-2">
        <Typography
          size="xs"
          transform="uppercase"
          className="text-on-surface-variant"
        >
          DISCOVER
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
    )}

    {archivedAt && (
      <section className="space-y-4 rounded-lg border border-outline/20 bg-surface-container-low p-4">
        <Typography size="sm" className="text-on-surface-variant">
          You marked this album as Not for Me.
        </Typography>
        <Button variant="outline" onClick={onUnarchive}>
          <Typography size="xs" transform="uppercase">
            BRING BACK
          </Typography>
        </Button>
      </section>
    )}

    {!archivedAt && (
      <>
        <div className="h-px bg-outline/20 my-8" />

        <section className="space-y-2">
          <Typography
            size="xs"
            className="text-center text-on-surface-variant mb-4"
          >
            Ready to decide?
          </Typography>

          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="primary"
                  className="w-full gap-4 justify-start pl-8"
                >
                  <Star className="size-4" />
                  <Typography size="xs" weight="bold" uppercase>
                    ADD TO WISHLIST
                  </Typography>
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Wishlist?</DialogTitle>
                <DialogDescription>
                  This album will be moved to your Wishlist so you can decide
                  later if it deserves a place in your collection.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="primary" onClick={onAddToWishlist}>
                  Add to Wishlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full gap-4 justify-start pl-8">
            <Compass className="size-4" />
            <Typography size="xs" weight="bold" uppercase>
              STILL EXPLORING
            </Typography>
          </Button>

          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full gap-4 justify-start pl-8"
                >
                  <X className="size-4" />
                  <Typography size="xs" weight="bold" uppercase>
                    NOT FOR ME
                  </Typography>
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Not for Me?</DialogTitle>
                <DialogDescription>
                  This album will be archived. You can bring it back later.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="primary" onClick={onArchive}>
                  Not for Me
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </>
    )}
  </>
);
