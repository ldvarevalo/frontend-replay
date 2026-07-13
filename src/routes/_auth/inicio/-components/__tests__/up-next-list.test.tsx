import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { UpNextList } from '../up-next-list';

const MOCK_ALBUMS = [
  {
    id: 'A.ALBUM.ONE',
    coverUrl: '',
    title: 'AN.ALBUM.TITLE',
    artist: 'AN.ARTIST.NAME',
  },
  {
    id: 'A.ALBUM.TWO',
    coverUrl: '',
    title: 'ANOTHER.ALBUM',
    artist: 'ANOTHER.ARTIST',
  },
];

describe('UpNextList', () => {
  it('should render all albums', () => {
    render(<UpNextList albums={MOCK_ALBUMS} onAlbumClick={vi.fn()} />);

    expect(screen.getByText('AN.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('ANOTHER.ALBUM')).toBeInTheDocument();
  });

  it('should fire onAlbumClick when clicking an album row', () => {
    const handleAlbumClickMock = vi.fn();

    render(
      <UpNextList albums={MOCK_ALBUMS} onAlbumClick={handleAlbumClickMock} />
    );

    fireEvent.click(screen.getByText('AN.ALBUM.TITLE'));
    expect(handleAlbumClickMock).toHaveBeenCalledWith(MOCK_ALBUMS[0]);
  });
});
