import { render, screen } from '@test-utils';

import { TopArtists } from '../top-artists';

/**
 * Constants
 */

const ARTISTS_MOCK = ['A.ARTIST.1', 'A.ARTIST.2', 'A.ARTIST.3', 'A.ARTIST.4'];
const MANY_ARTISTS_MOCK = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

/**
 * Tests
 */

describe('TopArtists', () => {
  it('should render up to 4 artists', () => {
    render(<TopArtists artists={ARTISTS_MOCK} />);

    expect(screen.getByText('A.ARTIST.1')).toBeInTheDocument();
    expect(screen.getByText('A.ARTIST.4')).toBeInTheDocument();
  });

  it('should show overflow count when more than 4 artists', () => {
    render(<TopArtists artists={MANY_ARTISTS_MOCK} />);

    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('should render nothing when empty', () => {
    const { container } = render(<TopArtists artists={[]} />);

    expect(container.innerHTML).toBe('');
  });
});
