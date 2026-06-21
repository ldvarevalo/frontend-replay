import { act, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@test-utils';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
import { setRepositories } from '#/repositories/instance';
import type { SearchItem } from '#/repositories/types';
import { useAlbumSearch } from '../use-album-search';

const item = (id: string): SearchItem => ({
  id,
  title: `T${id}`,
  artist: 'A',
  coverUrl: '',
  year: '',
  genre: '',
});

const setup = (
  localResults: SearchItem[],
  remoteResults: SearchItem[]
): void => {
  const releases = {
    findByQuery: vi.fn(async () => ({
      results: localResults.map(r => ({
        id: r.id,
        thumbnail: '',
        title: r.title,
        artist: r.artist,
        isAdded: false,
      })),
      totalPages: 1,
    })),
    create: vi.fn(),
    linkArtist: vi.fn(),
    linkGenre: vi.fn(),
    findById: vi.fn(),
  };
  const musicSearch = {
    search: vi.fn(async () => remoteResults),
  };
  setRepositories(
    createTestRepositories({
      releases,
      musicSearch,
    })
  );
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('useAlbumSearch', () => {
  it('should not fetch when query has fewer than 2 characters', async () => {
    setup([], []);

    const { result } = renderHook(() => useAlbumSearch());

    act(() => {
      result.current.setQuery('a');
    });

    await new Promise(r => setTimeout(r, 50));

    expect(result.current.results).toEqual([]);
  });

  it('should return local results when local returns matches', async () => {
    setup([item('1')], [item('2')]);

    const { result } = renderHook(() => useAlbumSearch());

    act(() => {
      result.current.setQuery('co');
    });

    await waitFor(() => {
      expect(result.current.results.map(r => r.id)).toEqual(['1']);
    });
  });

  it('should fall back to remote when local returns 0', async () => {
    setup([], [item('2')]);

    const { result } = renderHook(() => useAlbumSearch());

    act(() => {
      result.current.setQuery('coldpl');
    });

    await waitFor(() => {
      expect(result.current.results.map(r => r.id)).toEqual(['2']);
    });
  });
});
