import { render, screen } from '@test-utils';
import type { CollectionAlbum } from '#/types/domain';
import { CollectionAlbumGrid } from '../collection-album-grid';

/**
 * Mocks
 */

const handleAlbumClickMock = vi.fn();

/**
 * Tests
 */

describe('CollectionAlbumGrid', () => {
  const albums: CollectionAlbum[] = [
    {
      id: '1',
      coverUrl: 'https://example.com/1.jpg',
      title: 'Album 1',
      artist: 'Artist 1',
      year: '2001',
      status: 'owned' as const,
    },
    {
      id: '2',
      coverUrl: 'https://example.com/2.jpg',
      title: 'Album 2',
      artist: 'Artist 2',
      year: '2002',
      status: 'want' as const,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render album cards for each album', () => {
    render(
      <CollectionAlbumGrid
        albums={albums}
        onAlbumClick={handleAlbumClickMock}
      />
    );

    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
  });

  it('should fire onAlbumClick with album id', () => {
    render(
      <CollectionAlbumGrid
        albums={albums}
        onAlbumClick={handleAlbumClickMock}
      />
    );

    screen.getByText('Album 1').closest('button')?.click();

    expect(handleAlbumClickMock).toHaveBeenCalledWith('1');
  });
});
