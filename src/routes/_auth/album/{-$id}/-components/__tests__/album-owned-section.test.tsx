import { render, screen } from '@test-utils';
import type { AlbumDetail } from '#/types/domain';
import { AlbumOwnedSection } from '../album-owned-section';

/**
 * Constants
 */

const ALBUM_DETAIL_MOCK: AlbumDetail = {
  id: 'AN.ALBUM.ID',
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
  year: '2026',
  genre: 'Jazz',
  tracks: [
    {
      id: 'A.TRACK.ID',
      title: 'A.TRACK.TITLE',
      durationSeconds: 180,
      side: 'A',
      position: 1,
    },
    {
      id: 'ANOTHER.TRACK.ID',
      title: 'ANOTHER.TRACK.TITLE',
      durationSeconds: 240,
      side: 'A',
      position: 2,
    },
  ],
  status: 'owned',
  isListened: true,
  priority: null,
  addedAt: null,
  archivedAt: null,
};

/**
 * Tests
 */

describe('AlbumOwnedSection', () => {
  it('should render collection status options', () => {
    render(
      <AlbumOwnedSection
        album={ALBUM_DETAIL_MOCK}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={vi.fn()}
        onAddTracks={vi.fn()}
        onNewSession={vi.fn()}
      />
    );

    expect(screen.getByText('COLLECTION STATUS')).toBeInTheDocument();
    expect(screen.getByText('discover')).toBeInTheDocument();
    expect(screen.getByText('want')).toBeInTheDocument();
    expect(screen.getByText('owned')).toBeInTheDocument();
  });

  it('should render tracks', () => {
    render(
      <AlbumOwnedSection
        album={ALBUM_DETAIL_MOCK}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={vi.fn()}
        onAddTracks={vi.fn()}
        onNewSession={vi.fn()}
      />
    );

    expect(screen.getByText('A.TRACK.TITLE')).toBeInTheDocument();
    expect(screen.getByText('ANOTHER.TRACK.TITLE')).toBeInTheDocument();
  });

  it('should render ADD TRACKS button', () => {
    render(
      <AlbumOwnedSection
        album={ALBUM_DETAIL_MOCK}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={vi.fn()}
        onAddTracks={vi.fn()}
        onNewSession={vi.fn()}
      />
    );

    expect(screen.getByText('ADD TRACKS')).toBeInTheDocument();
  });

  it('should call onAddTracks when button clicked', () => {
    const handleAddTracksMock = vi.fn();

    render(
      <AlbumOwnedSection
        album={ALBUM_DETAIL_MOCK}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={vi.fn()}
        onAddTracks={handleAddTracksMock}
        onNewSession={vi.fn()}
      />
    );

    screen.getByText('ADD TRACKS').click();

    expect(handleAddTracksMock).toHaveBeenCalledTimes(1);
  });
});
