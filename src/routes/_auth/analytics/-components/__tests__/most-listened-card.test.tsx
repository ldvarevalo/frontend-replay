import { render, screen } from '@test-utils';

import type { MostListenedAlbum } from '#/types/domain';
import { MostListenedCard } from '../most-listened-card';

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

describe('MostListenedCard', () => {
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
      <MostListenedCard
        album={MOST_LISTENED_ALBUM_MOCK}
        onViewAlbum={handleViewAlbumMock}
      />
    );

    expect(screen.getByText('A.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
    expect(screen.getByText('5 listening sessions')).toBeInTheDocument();
    expect(screen.getByText('2h 15m total')).toBeInTheDocument();
    expect(screen.getByText('View album')).toBeInTheDocument();
  });

  it('should call onViewAlbum when CTA is clicked', () => {
    render(
      <MostListenedCard
        album={MOST_LISTENED_ALBUM_MOCK}
        onViewAlbum={handleViewAlbumMock}
      />
    );

    screen.getByText('View album').click();

    expect(handleViewAlbumMock).toHaveBeenCalledWith('A.ALBUM.ID');
  });

  it('should not render when album is null', () => {
    const { container } = render(
      <MostListenedCard album={null} onViewAlbum={handleViewAlbumMock} />
    );

    expect(container.innerHTML).toBe('');
  });
});
