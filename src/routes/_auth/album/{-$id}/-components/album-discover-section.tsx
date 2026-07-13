import { useState } from 'react';
import type { FunctionComponent } from 'react';
import { Calendar, Compass, Headphones, Star, X } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '#/components/ui/dialog';
import { Typography } from '#/components/ui/typography';
import { formatDate } from '#/core/helpers/format-date';
import { getListeningScopeLabel } from '#/core/helpers/listening-scope-labels/listening-scope-labels';
import { useLogListeningSession } from '#/routes/_auth/album/{-$id}/session/-hooks/use-log-listening-session';
import type { ListeningScope } from '#/types/domain';

/**
 * Types
 */

interface AlbumDiscoverSectionProps {
  albumId: string;
  addedAt: string | null;
  archivedAt: string | null;
  lastSessionScope: ListeningScope | null;
  lastSessionListenedAt: string | null;
  onAddToWishlist: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
}

/**
 * AlbumDiscoverSection
 */

export const AlbumDiscoverSection: FunctionComponent<
  AlbumDiscoverSectionProps
> = ({
  albumId,
  addedAt,
  archivedAt,
  lastSessionScope,
  lastSessionListenedAt,
  onAddToWishlist,
  onArchive,
  onUnarchive,
}) => {
  const [hasLoggedSession, setHasLoggedSession] = useState(false);
  const { mutate: logSession, isPending } =
    useLogListeningSession(albumId);
  const [selectedScope, setSelectedScope] =
    useState<ListeningScope>('full_release');

  const handleSave = (): void => {
    logSession(
      { scope: selectedScope },
      {
        onSuccess: () => {
          setHasLoggedSession(true);
        },
      }
    );
  };

  return (
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
          <section className="space-y-2">
            {hasLoggedSession && lastSessionScope && lastSessionListenedAt ? (
              <div className="flex items-center gap-3 bg-surface-container-high px-4 py-3">
                <Headphones className="size-5 text-tertiary" />
                <div className="flex flex-col">
                  <Typography size="xs" className="text-on-surface-variant">
                    Last listened {formatDate(lastSessionListenedAt)}
                  </Typography>
                  <Typography
                    family="heading"
                    size="lg"
                    className="text-tertiary"
                  >
                    {getListeningScopeLabel(lastSessionScope)}
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography size="sm" uppercase className="text-on-surface-variant">
                Have you listened to this album?
              </Typography>
            )}

            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    <Headphones className="size-4" />
                      {hasLoggedSession
                        ? 'LOG ANOTHER SESSION'
                        : 'LOG LISTENING SESSION'}
                  </Button>
                }
              />
              <DialogContent position="bottom" showCloseButton={false}>
                <DialogHeader>
                  <Typography family="heading" size="lg">
                    Have you listened to this album?
                  </Typography>
                </DialogHeader>

                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedScope === 'full_release' ? 'primary' : 'outline'
                    }
                    className="flex-1"
                    onClick={() => setSelectedScope('full_release')}
                  >
                    <Typography size="xs" weight="bold">
                      FULL ALBUM
                    </Typography>
                  </Button>
                  <Button
                    variant={
                      selectedScope === 'partial_release' ? 'primary' : 'outline'
                    }
                    className="flex-1"
                    onClick={() => setSelectedScope('partial_release')}
                  >
                    <Typography size="xs" weight="bold">
                      PART OF THE ALBUM
                    </Typography>
                  </Button>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  <Typography size="xs" weight="bold" uppercase>
                    SAVE
                  </Typography>
                </Button>
              </DialogContent>
            </Dialog>
          </section>

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
                  <Typography family="heading" size="lg">
                    Add to Wishlist?
                  </Typography>
                </DialogHeader>
                <Typography size="sm" className="text-on-surface-variant">
                  This album will be moved to your Wishlist so you can decide
                  later if it deserves a place in your collection.
                </Typography>
                <Button variant="primary" onClick={onAddToWishlist}>
                  <Typography size="xs" weight="bold" uppercase>
                    ADD TO WISHLIST
                  </Typography>
                </Button>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full gap-4 justify-start pl-8"
            >
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
                  <Typography family="heading" size="lg">
                    Not for Me?
                  </Typography>
                </DialogHeader>
                <Typography size="sm" className="text-on-surface-variant">
                  This album will be archived. You can bring it back later.
                </Typography>
                <Button variant="primary" onClick={onArchive}>
                  <Typography size="xs" weight="bold" uppercase>
                    NOT FOR ME
                  </Typography>
                </Button>
              </DialogContent>
            </Dialog>
          </section>
        </>
      )}
    </>
  );
};
