import { render, screen } from '@test-utils';
import { AlbumRow } from '../album-row';

describe('AlbumRow', () => {
  const defaultProps = {
    thumbnail: 'https://example.com/thumb.jpg',
    title: 'A Love Supreme',
    artist: 'John Coltrane',
    onClick: () => {},
  };

  it('should render title, artist and thumbnail', () => {
    render(<AlbumRow {...defaultProps} />);
    expect(screen.getByText('A Love Supreme')).toBeInTheDocument();
    expect(screen.getByText('John Coltrane')).toBeInTheDocument();
    expect(screen.getByAltText('A Love Supreme')).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });

  it('should render duration when provided', () => {
    render(<AlbumRow {...defaultProps} duration="5:30" />);
    expect(screen.getByText('5:30')).toBeInTheDocument();
  });

  it('should render actionIcon instead of duration when provided', () => {
    render(<AlbumRow {...defaultProps} actionIcon={<span data-testid="action-icon">+</span>} />);
    expect(screen.getByTestId('action-icon')).toBeInTheDocument();
    expect(screen.queryByText('5:30')).not.toBeInTheDocument();
  });

  it('should apply isActive class', () => {
    const { container } = render(<AlbumRow {...defaultProps} isActive />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('should fire onClick when clicked', () => {
    const onClick = vi.fn();
    render(<AlbumRow {...defaultProps} onClick={onClick} />);
    screen.getByText('A Love Supreme').closest('button')?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
