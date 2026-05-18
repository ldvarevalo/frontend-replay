import { render, screen } from '@test-utils';
import { CollectionAlbumGrid } from '../collection-album-grid';

describe('CollectionAlbumGrid', () => {
  const albums = [
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

  it('should render album cards for each album', () => {
    render(<CollectionAlbumGrid albums={albums} onAlbumClick={() => {}} />);
    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
  });

  it('should fire onAlbumClick with album id', () => {
    const onAlbumClick = vi.fn();
    render(<CollectionAlbumGrid albums={albums} onAlbumClick={onAlbumClick} />);
    screen.getByText('Album 1').closest('button')?.click();
    expect(onAlbumClick).toHaveBeenCalledWith('1');
  });
});
