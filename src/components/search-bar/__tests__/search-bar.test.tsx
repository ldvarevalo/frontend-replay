import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { SearchBar } from '../search-bar';

/**
 * Mocks
 */

const handleChangeMock = vi.fn();

/**
 * Tests
 */

describe('SearchBar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render input with default placeholder', () => {
    render(<SearchBar value="" onChange={handleChangeMock} />);

    expect(
      screen.getByPlaceholderText('Search archive...')
    ).toBeInTheDocument();
  });

  it('should render custom placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={handleChangeMock}
        placeholder="Search albums..."
      />
    );

    expect(screen.getByPlaceholderText('Search albums...')).toBeInTheDocument();
  });

  it('should pass value to input', () => {
    render(<SearchBar value="test" onChange={handleChangeMock} />);

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('should fire onChange when input changes', () => {
    render(<SearchBar value="" onChange={handleChangeMock} />);

    const input = screen.getByPlaceholderText('Search archive...');
    fireEvent.change(input, { target: { value: 'jazz' } });

    expect(handleChangeMock).toHaveBeenCalledTimes(1);
  });
});
