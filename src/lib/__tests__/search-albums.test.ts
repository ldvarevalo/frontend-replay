import type { SearchItem } from '#/repositories/types';
import { searchAlbums } from '../search-albums';

/**
 * Helpers
 */

const item = (id: string, title: string): SearchItem => ({
  id,
  title,
  artist: 'A',
  coverUrl: '',
  year: '',
  genre: '',
});

/**
 * searchAlbums
 */

describe('searchAlbums', () => {
  it('should return local results without calling remote when local has matches', async () => {
    const local = vi.fn(async (_q: string) => [item('1', 'Local A')]);
    const remote = vi.fn(async (_q: string) => [item('2', 'Remote A')]);

    const result = await searchAlbums('q', local, remote);

    expect(result).toEqual([item('1', 'Local A')]);
    expect(local).toHaveBeenCalledWith('q');
    expect(remote).not.toHaveBeenCalled();
  });

  it('should call remote with the query when local returns empty', async () => {
    const local = vi.fn(async (_q: string) => []);
    const remote = vi.fn(async (_q: string) => [item('2', 'Remote A')]);

    const result = await searchAlbums('coldpl', local, remote);

    expect(local).toHaveBeenCalledWith('coldpl');
    expect(remote).toHaveBeenCalledWith('coldpl');
    expect(result).toEqual([item('2', 'Remote A')]);
  });

  it('should return [] when both local and remote return empty', async () => {
    const local = vi.fn(async (_q: string) => []);
    const remote = vi.fn(async (_q: string) => []);

    const result = await searchAlbums('x', local, remote);

    expect(result).toEqual([]);
  });
});
