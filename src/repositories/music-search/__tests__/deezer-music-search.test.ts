import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { DeezerMusicSearchRepository } from '../deezer-music-search';

/**
 * Helpers
 */

interface MockResponse {
  ok: boolean;
  body: unknown;
}

const mockFetch = (responses: MockResponse[]): void => {
  let i = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      const r = responses[i++] ?? {
        ok: true,
        body: {},
      };

      return {
        ok: r.ok,
        json: async () => r.body,
      } as Response;
    })
  );
};

/**
 * Tests
 */

describe('DeezerMusicSearchRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should map search/album response to SearchItem[] with cover_big and year', async () => {
    mockFetch([
      {
        ok: true,
        body: {
          data: [
            {
              id: 111,
              title: 'A Love Supreme',
              cover_big: 'https://cdn.deezer/cover-big.jpg',
              release_date: '1965-02-09',
              artist: {
                id: 1,
                name: 'John Coltrane',
              },
            },
          ],
        },
      },
      {
        ok: true,
        body: {
          genres: [
            {
              name: 'Jazz',
            },
          ],
        },
      },
    ]);

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('coltrane');

    expect(result).toEqual([
      {
        id: '111',
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        coverUrl: 'https://cdn.deezer/cover-big.jpg',
        year: '1965',
        genre: 'Jazz',
      },
    ]);
  });

  it('should return [] when /search/album fetch fails', async () => {
    mockFetch([
      {
        ok: false,
        body: {},
      },
    ]);
    const repo = new DeezerMusicSearchRepository();

    const result = await repo.search('coltrane');

    expect(result).toEqual([]);
  });

  it('should return [] when /search/album throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      })
    );
    const repo = new DeezerMusicSearchRepository();

    const result = await repo.search('coltrane');

    expect(result).toEqual([]);
  });

  it('should keep items without genre when /album/{id} enrichment fails', async () => {
    mockFetch([
      {
        ok: true,
        body: {
          data: [
            {
              id: 1,
              title: 'Album A',
              cover_big: 'https://a',
              release_date: '2000-01-01',
              artist: {
                name: 'Artist A',
              },
            },
            {
              id: 2,
              title: 'Album B',
              cover_big: 'https://b',
              release_date: '2010-05-15',
              artist: {
                name: 'Artist B',
              },
            },
          ],
        },
      },
      {
        ok: false,
        body: {},
      },
      {
        ok: true,
        body: {
          genres: [
            {
              name: 'Rock',
            },
          ],
        },
      },
    ] as MockResponse[]);

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('a');

    expect(result[0].genre).toBe('');
    expect(result[1].genre).toBe('Rock');
  });

  it('should cap genre enrichment to 5 items even when more are returned', async () => {
    const items = Array.from(
      {
        length: 8,
      },
      (_, i) => ({
        id: i,
        title: `A${i}`,
        cover_big: 'x',
        release_date: '2020-01-01',
        artist: {
          name: 'X',
        },
      })
    );
    const responses: MockResponse[] = [
      {
        ok: true,
        body: {
          data: items,
        },
      },
    ];
    for (let i = 0; i < 5; i++) {
      responses.push({
        ok: true,
        body: {
          genres: [
            {
              name: 'Pop',
            },
          ],
        },
      });
    }

    mockFetch(responses);

    const repo = new DeezerMusicSearchRepository();
    const result = await repo.search('a');

    expect(result).toHaveLength(8);
    expect(result.slice(0, 5).every(r => r.genre === 'Pop')).toBe(true);
    expect(result.slice(5).every(r => r.genre === '')).toBe(true);
  });
});
