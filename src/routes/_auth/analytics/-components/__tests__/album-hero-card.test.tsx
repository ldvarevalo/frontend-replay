import { render, screen } from '@test-utils';

import type { MostListenedAlbum } from '#/types/domain';
import { AlbumHeroCard } from '../album-hero-card';

/**
 * Mocks
 */

const handleViewAlbumMock = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Tests
 */

describe('AlbumHeroCard', () => {
  const MOST_LISTENED_ALBUM_MOCK: MostListenedAlbum = {
    id: 'A.ALBUM.ID',
    coverUrl: 'A.COVER.URL',
    title: 'A.ALBUM.TITLE',
    artist: 'AN.ARTIST.NAME',
    sessionCount: 5,
    totalDurationSeconds: 8100,
  };

  it('should render album details', () => {
    render(
      <AlbumHeroCard
        album={MOST_LISTENED_ALBUM_MOCK}
        onViewAlbum={handleViewAlbumMock}
      />
    );

    expect(screen.getByText('MOST LISTENED ALBUM')).toBeInTheDocument();
    expect(screen.getByText('A.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('sessions')).toBeInTheDocument();
    expect(screen.getByText('2h 15m')).toBeInTheDocument();
    expect(screen.getByText('total time')).toBeInTheDocument();
    expect(screen.getByText('View album')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'A.COVER.URL');
  });

  it('should call onViewAlbum when CTA is clicked', () => {
    render(
      <AlbumHeroCard
        album={MOST_LISTENED_ALBUM_MOCK}
        onViewAlbum={handleViewAlbumMock}
      />
    );

    screen.getByText('View album').click();

    expect(handleViewAlbumMock).toHaveBeenCalledWith('A.ALBUM.ID');
  });
});
