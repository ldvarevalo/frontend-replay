import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
  it('should render input with default placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Search archive...')).toBeInTheDocument();
  });

  it('should render custom placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search albums..." />);
    expect(screen.getByPlaceholderText('Search albums...')).toBeInTheDocument();
  });

  it('should pass value to input', () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('should fire onChange when input changes', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search archive...');
    fireEvent.change(input, { target: { value: 'jazz' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
