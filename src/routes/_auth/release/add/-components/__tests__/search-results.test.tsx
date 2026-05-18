import { render, screen } from '@test-utils';
import { SearchResults } from '../search-results';

describe('SearchResults', () => {
  const results = [
    { id: '1',
title: 'Album 1',
artist: 'Artist 1',
thumbnail: 'https://example.com/1.jpg',
isAdded: false },
    { id: '2',
title: 'Album 2',
artist: 'Artist 2',
thumbnail: 'https://example.com/2.jpg',
isAdded: true },
  ];

  it('should render album rows for each result', () => {
    render(<SearchResults results={results} onToggle={() => {}} />);
    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
  });

  it('should fire onToggle when row clicked', () => {
    const onToggle = vi.fn();
    render(<SearchResults results={results} onToggle={onToggle} />);
    screen.getByText('Album 1').closest('button')?.click();
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
