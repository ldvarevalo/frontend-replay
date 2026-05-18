import { render, screen } from '@test-utils';
import type { SearchResult } from '../../-hooks/use-search-releases';
import { SearchResults } from '../search-results';

/**
 * Mocks
 */

const handleToggleMock = vi.fn();

/**
 * Tests
 */

describe('SearchResults', () => {
  const results: SearchResult[] = [
    {
      id: '1',
      title: 'Album 1',
      artist: 'Artist 1',
      thumbnail: 'https://example.com/1.jpg',
      isAdded: false,
    },
    {
      id: '2',
      title: 'Album 2',
      artist: 'Artist 2',
      thumbnail: 'https://example.com/2.jpg',
      isAdded: true,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render album rows for each result', () => {
    render(<SearchResults results={results} onToggle={handleToggleMock} />);

    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
  });

  it('should fire onToggle when row clicked', () => {
    render(<SearchResults results={results} onToggle={handleToggleMock} />);

    screen.getByText('Album 1').closest('button')?.click();

    expect(handleToggleMock).toHaveBeenCalledWith('1');
  });
});
