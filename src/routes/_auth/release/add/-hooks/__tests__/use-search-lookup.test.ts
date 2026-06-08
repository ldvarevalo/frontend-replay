import { act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@test-utils';
import { useSearchLookup } from '../use-search-lookup';

const mockSearchFn = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSearchLookup', () => {
  it('should not fetch when query is shorter than 2 characters', () => {
    const { result } = renderHook(() =>
      useSearchLookup({ searchFn: mockSearchFn })
    );

    act(() => {
      result.current.onSearch('a');
    });

    expect(mockSearchFn).not.toHaveBeenCalled();
  });

  it('should fetch results after debounce when query has 2+ characters', async () => {
    mockSearchFn.mockResolvedValue([{ id: '1',
name: 'Rock' }]);

    const { result } = renderHook(() =>
      useSearchLookup({ searchFn: mockSearchFn,
debounceMs: 100 })
    );

    act(() => {
      result.current.onSearch('ro');
    });

    await waitFor(() => {
      expect(mockSearchFn).toHaveBeenCalledWith('ro');
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: '1',
name: 'Rock' }]);
    });
  });

  it('should set isSearching during fetch', async () => {
    let resolvePromise: (value: unknown) => void = () => {};
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSearchFn.mockReturnValue(promise);

    const { result } = renderHook(() =>
      useSearchLookup({ searchFn: mockSearchFn,
debounceMs: 100 })
    );

    act(() => {
      result.current.onSearch('ro');
    });

    await waitFor(() => {
      expect(result.current.isSearching).toBe(true);
    });

    await act(async () => {
      resolvePromise!([{ id: '1',
name: 'Rock' }]);
    });
  });
});
