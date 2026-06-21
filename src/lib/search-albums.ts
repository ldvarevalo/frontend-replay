import type { SearchItem } from '#/repositories/types';

/**
 * searchAlbums
 */

export const searchAlbums = async (
  query: string,
  local: (q: string) => Promise<SearchItem[]>,
  remote: (q: string) => Promise<SearchItem[]>
): Promise<SearchItem[]> => {
  const localResults = await local(query);

  if (localResults.length > 0) {
    return localResults;
  }

  return remote(query);
};
