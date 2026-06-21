import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@test-utils';
import { SearchableSelect } from '../searchable-select';

describe('SearchableSelect', () => {
  const defaultProps = {
    value: '',
    placeholder: 'Select an option',
    results: [] as Array<{ id: string; name: string }>,
    isSearching: false,
    onSearch: vi.fn(),
    onChange: vi.fn(),
  };

  it('should render placeholder when value is empty', () => {
    render(<SearchableSelect {...defaultProps} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should render selected value when provided', () => {
    render(<SearchableSelect {...defaultProps} value="Rock" />);
    expect(screen.getByText('Rock')).toBeInTheDocument();
  });

  it('should call onChange when a result is selected', () => {
    const onChange = vi.fn();
    render(
      <SearchableSelect
        {...defaultProps}
        results={[
          {
            id: '1',
            name: 'Rock',
          },
          {
            id: '2',
            name: 'Jazz',
          },
        ]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    fireEvent.click(screen.getByText('Rock'));

    expect(onChange).toHaveBeenCalledWith('Rock');
  });

  it('should show create option when no results and query has 2+ chars', () => {
    render(<SearchableSelect {...defaultProps} results={[]} />);

    fireEvent.click(screen.getByText('Select an option'));
    const searchInput = screen.getByPlaceholderText('Select an option');
    fireEvent.change(searchInput, { target: { value: 'Ro' } });

    expect(screen.getByText(/Create.*Ro/)).toBeInTheDocument();
  });

  it('should render thumbnail and subtitle when present on results', () => {
    render(
      <SearchableSelect
        {...defaultProps}
        results={[
          {
            id: '1',
            name: 'A Love Supreme',
            thumbnail: 'https://cdn/cover.jpg',
            subtitle: 'John Coltrane',
          },
        ]}
      />
    );

    fireEvent.click(screen.getByText('Select an option'));

    const img = screen.getByRole('img', { name: 'A Love Supreme' });
    expect(img).toHaveAttribute('src', 'https://cdn/cover.jpg');
    expect(screen.getByText('John Coltrane')).toBeInTheDocument();
  });

  it('should call onSelect with the full result when provided', () => {
    const onSelect = vi.fn();
    render(
      <SearchableSelect
        {...defaultProps}
        results={[
          {
            id: '1',
            name: 'Rock',
          },
        ]}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    fireEvent.click(screen.getByText('Rock'));

    expect(onSelect).toHaveBeenCalledWith({
      id: '1',
      name: 'Rock',
    });
  });

  it('should render emptyMessage when results are empty', () => {
    render(
      <SearchableSelect
        {...defaultProps}
        results={[]}
        emptyMessage="No matches"
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    const searchInput = screen.getByPlaceholderText('Select an option');
    fireEvent.change(searchInput, { target: { value: 'ab' } });

    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('should apply a separator class to each CommandItem so rows are visually divided', () => {
    render(
      <SearchableSelect
        {...defaultProps}
        results={[
          {
            id: '1',
            name: 'Rock',
          },
          {
            id: '2',
            name: 'Jazz',
          },
        ]}
      />
    );

    fireEvent.click(screen.getByText('Select an option'));

    const items = screen.getAllByRole('option');
    expect(items[0].className).toMatch(/border-b/);
    expect(items[0].className).toMatch(/last:border-b-0/);
    expect(items[1].className).toMatch(/border-b/);
    expect(items[1].className).toMatch(/last:border-b-0/);
  });
});
