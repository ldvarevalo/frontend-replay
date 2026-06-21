import { render, screen } from '@test-utils';
import { AlbumCard, type AlbumCardProps } from '../album-card';

describe('AlbumCard', () => {
  const defaultProps: AlbumCardProps = {
    coverUrl: 'https://example.com/cover.jpg',
    title: 'A Love Supreme',
    artist: 'John Coltrane',
    onClick: vi.fn(),
  };

  it('should render title and artist', () => {
    render(<AlbumCard {...defaultProps} />);

    expect(screen.getByText('A Love Supreme')).toBeInTheDocument();
    expect(screen.getByText('John Coltrane')).toBeInTheDocument();
  });

  it('should render year when provided', () => {
    render(<AlbumCard {...defaultProps} year="1965" />);

    expect(screen.getByText('1965')).toBeInTheDocument();
  });

  it('should not render year when not provided', () => {
    render(<AlbumCard {...defaultProps} />);

    expect(screen.queryByText('1965')).not.toBeInTheDocument();
  });

  it('should render image with coverUrl as src', () => {
    render(<AlbumCard {...defaultProps} />);

    const img = screen.getByAltText('A Love Supreme');

    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('should fire onClick when clicked', () => {
    const handleClickMock = vi.fn();

    render(<AlbumCard {...defaultProps} onClick={handleClickMock} />);
    screen.getByText('A Love Supreme').closest('button')?.click();

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });

  it('should render with year and match snapshot', () => {
    const { container } = render(<AlbumCard {...defaultProps} year="1965" />);

    expect(screen.getByText('1965')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render listened album and match snapshot', () => {
    const { container } = render(<AlbumCard {...defaultProps} isListened />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
