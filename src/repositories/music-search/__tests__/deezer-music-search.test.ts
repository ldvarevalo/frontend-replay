import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeezerMusicSearchRepository } from '../deezer-music-search';
import type { SearchItem } from '../types';

/**
 * Helpers
 */

const mockResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

const setUpMockFetch = (responses: Response[]): void => {
  const fn = vi.fn();
  responses.forEach(r => fn.mockReturnValueOnce(r));
  vi.stubGlobal('fetch', fn);
};

/**
 * Tests
 */

describe('DeezerMusicSearchRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_API_URL = 'http://localhost:3001';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return SearchItem[] from backend', async () => {
    const expected: SearchItem[] = [
      {
        id: '111',
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        coverUrl: 'https://cdn.deezer/cover-big.jpg',
        year: '1965',
        genre: 'Jazz',
      },
    ];

    setUpMockFetch([
      mockResponse(200, { data: expected }),
    ]);

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('coltrane');

    expect(result).toEqual(expected);
  });

  it('should return [] when backend returns error', async () => {
    setUpMockFetch([
      mockResponse(500, {}),
    ]);

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('coltrane');

    expect(result).toEqual([]);
  });

  it('should return [] when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('coltrane');

    expect(result).toEqual([]);
  });
});
