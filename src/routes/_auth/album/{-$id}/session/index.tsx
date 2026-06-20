/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlbumHero } from '#/components/album-hero';
import { Typography } from '#/components/ui/typography';
import { router } from '#/router';
import type { ListeningScope, SourceFormat } from '#/types/domain';
import { ActionButtons } from './-components/action-buttons';
import { DurationInput } from './-components/duration-input';
import { ListeningModeTabs } from './-components/listening-mode-tabs';
import { NewSessionDivider } from './-components/new-session-divider';
import { SourceFormatCards } from './-components/source-format-cards';
import { useCreateSession } from './-hooks/use-create-session';
import { useAlbumData } from '../../-hooks/use-album-data';

/**
 * Types
 */

interface SessionParams {
  id?: string;
}

/**
 * Constants
 */

const ALBUM_MODES: ListeningScope[] = ['full_release', 'side_a', 'side_b'];

/**
 * SessionPage
 */

// eslint-disable-next-line max-statements
const SessionPage: FunctionComponent = () => {
  const { id } = Route.useParams() as SessionParams;
  const navigate = useNavigate();
  const { album, isLoading, isError } = useAlbumData(id);
  const { mutate: createSession, isPending } = useCreateSession(id);

  const [activeMode, setActiveMode] = useState<ListeningScope>('full_release');
  const [sourceFormat, setSourceFormat] = useState<SourceFormat>('vinyl');
  const [duration, setDuration] = useState<string>('');

  const totalSeconds = useMemo(() => {
    if (!album?.tracks || album.tracks.length === 0) {
      return '';
    }

    const filtered =
      activeMode === 'full_release'
        ? album.tracks
        : album.tracks.filter(t => t.side === activeMode);

    if (filtered.length === 0) {
      return '';
    }

    const total = filtered.reduce(
      (sum, t) => sum + (t.durationSeconds ?? 0),
      0
    );

    if (total === 0) {
      return '';
    }

    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    return `${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}${s.toString().padStart(2, '0')}`;
  }, [activeMode, album?.tracks]);

  useEffect(() => {
    if (totalSeconds) {
      setDuration(totalSeconds);
    }
  }, [totalSeconds]);

  if (!id) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <Typography
            family="heading"
            size="2xl"
            weight="bold"
            className="text-on-surface-variant"
          >
            Album not found
          </Typography>
          <Typography className="mt-2 text-on-surface-variant">
            The album ID is missing.
          </Typography>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <Typography className="text-on-surface-variant">Loading...</Typography>
      </main>
    );
  }

  if (isError || !album) {
    return (
      <main className="page-wrap flex items-center justify-center py-20">
        <div className="text-center">
          <Typography
            family="heading"
            size="2xl"
            weight="bold"
            className="text-on-surface-variant"
          >
            Album not found
          </Typography>
          <Typography className="mt-2 text-on-surface-variant">
            The album could not be loaded.
          </Typography>
        </div>
      </main>
    );
  }

  const handleSubmit = (): void => {
    createSession({
      scope: activeMode,
      sourceFormat,
      duration,
    });

    navigate({
      to: '/album/$id',
      params: { id },
    });
  };

  const handleCancel = (): void => {
    navigate({
      to: '/album/$id',
      params: { id },
    });
  };

  return (
    <div className="flex flex-col">
      <AlbumHero
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
        variant="cover"
      />

      <main className="page-wrap mt-4 space-y-6 pb-8">
        <NewSessionDivider />

        <div className="space-y-4 px-4">
          <Typography
            size="xs"
            weight="bold"
            transform="uppercase"
            tracking="widest"
            className="text-on-surface-variant"
          >
            LISTENING MODE
          </Typography>
          <ListeningModeTabs
            modes={ALBUM_MODES}
            activeMode={activeMode}
            onChange={setActiveMode}
          />
        </div>

        <div className="space-y-4 px-4">
          <Typography
            size="xs"
            weight="bold"
            transform="uppercase"
            tracking="widest"
            className="text-on-surface-variant"
          >
            SOURCE FORMAT
          </Typography>
          <SourceFormatCards value={sourceFormat} onChange={setSourceFormat} />
        </div>

        <div className="space-y-4 px-4">
          <Typography
            size="xs"
            weight="bold"
            transform="uppercase"
            tracking="widest"
            className="text-on-surface-variant"
          >
            TOTAL DURATION
          </Typography>
          <DurationInput value={duration} onChange={setDuration} />
        </div>

        <ActionButtons
          isValid={true}
          isPending={isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
};

/**
 * SessionRoute
 */

export const Route = createFileRoute('/_auth/album/{-$id}/session/')({
  component: SessionPage,
  loader: async ({ params }) => ({
    pageHeader: {
      title: 'Crate',
      onBack: () =>
        router.navigate({
          to: '/album/{-$contentId}',
          params: { contentId: params.id },
        }),
    },
  }),
});
