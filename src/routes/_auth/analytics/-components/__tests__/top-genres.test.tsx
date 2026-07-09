import { render, screen } from '@test-utils';

import { TopGenres } from '../top-genres';

/**
 * Constants
 */

const GENRES_MOCK = [
  'Alternative',
  'Indie Rock',
  'Dream Pop',
  'Post Punk',
  'Britpop',
  'Jazz',
];

/**
 * Tests
 */

describe('TopGenres', () => {
  it('should render up to 6 genre chips', () => {
    render(<TopGenres genres={GENRES_MOCK} />);

    expect(screen.getByText('Alternative')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });

  it('should render nothing when empty', () => {
    const { container } = render(<TopGenres genres={[]} />);

    expect(container.innerHTML).toBe('');
  });
});
