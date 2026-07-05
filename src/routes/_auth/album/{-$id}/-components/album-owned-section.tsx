import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import type {
  AlbumDetail,
  CollectionStatus,
  SourceFormat,
} from '#/types/domain';
import { AlbumListeningHistory } from '../../-components/album-listening-history';
import { AlbumRating } from '../../-components/album-rating';
import { AlbumTracklist } from '../../-components/album-tracklist';
import { OptionGroup } from '../../-components/option-group';

/**
 * Types
 */

interface SessionDisplay {
  id: string;
  listenedAt: string;
  scopeLabel: string;
  sourceFormat: SourceFormat;
}

interface AlbumOwnedSectionProps {
  album: AlbumDetail;
  sessions: SessionDisplay[];
  sessionsLoading: boolean;
  onCollectionStatusChange: (status: CollectionStatus) => void;
  onAddTracks: () => void;
  onNewSession: () => void;
}

/**
 * Constants
 */

const STATUS_OPTIONS: CollectionStatus[] = ['discover', 'want', 'owned'];

/**
 * AlbumOwnedSection
 */

export const AlbumOwnedSection: FunctionComponent<AlbumOwnedSectionProps> = ({
  album,
  sessions,
  sessionsLoading,
  onCollectionStatusChange,
  onAddTracks,
  onNewSession,
}) => (
  <>
    <OptionGroup
      label="COLLECTION STATUS"
      options={STATUS_OPTIONS}
      value={album.status}
      onChange={value => onCollectionStatusChange(value as CollectionStatus)}
    />

    <AlbumRating />

    <AlbumTracklist tracks={album.tracks} />

    <Button variant="outline" className="w-full" onClick={onAddTracks}>
      <Typography size="xs" transform="uppercase">
        ADD TRACKS
      </Typography>
    </Button>

    <AlbumListeningHistory
      sessions={sessions}
      isLoading={sessionsLoading}
      onNewSessionClick={onNewSession}
    />
  </>
);
