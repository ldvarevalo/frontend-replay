import { render, screen } from '@test-utils';
import type { AlbumDetail } from '#/types/domain';
import { AlbumOwnedSection } from '../album-owned-section';

/**
 * Constants
 */

const mockAlbum: AlbumDetail = {
  id: 'album-1',
  coverUrl: 'https://example.com/cover.jpg',
  title: 'Test Album',
  artist: 'Test Artist',
  year: '2026',
  genre: 'Jazz',
  tracks: [
    {
      id: 't-1',
      title: 'Track 1',
      durationSeconds: 180,
      side: 'A',
      position: 1,
    },
    {
      id: 't-2',
      title: 'Track 2',
      durationSeconds: 240,
      side: 'A',
      position: 2,
    },
  ],
  status: 'owned',
  isListened: true,
  priority: null,
  addedAt: null,
};

/**
 * Tests
 */

describe('AlbumOwnedSection', () => {
  it('should render collection status options', () => {
    render(
      <AlbumOwnedSection
        album={mockAlbum}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={() => {}}
        onAddTracks={() => {}}
        onNewSession={() => {}}
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
        album={mockAlbum}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={() => {}}
        onAddTracks={() => {}}
        onNewSession={() => {}}
      />
    );

    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
  });

  it('should render ADD TRACKS button', () => {
    render(
      <AlbumOwnedSection
        album={mockAlbum}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={() => {}}
        onAddTracks={() => {}}
        onNewSession={() => {}}
      />
    );

    expect(screen.getByText('ADD TRACKS')).toBeInTheDocument();
  });

  it('should call onAddTracks when button clicked', () => {
    const onAddTracks = vi.fn();

    render(
      <AlbumOwnedSection
        album={mockAlbum}
        sessions={[]}
        sessionsLoading={false}
        onCollectionStatusChange={vi.fn()}
        onAddTracks={onAddTracks}
        onNewSession={vi.fn()}
      />
    );

    screen.getByText('ADD TRACKS').click();

    expect(onAddTracks).toHaveBeenCalledTimes(1);
  });
});
