import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchAlbums } from '#/lib/search-albums';
import { useRepositories } from '#/repositories/hooks';
import type { SearchItem } from '#/repositories/types';
import type { SearchResult } from '#/types/domain';

/**
 * Types
 */

interface UseAlbumSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: SearchItem[];
  isPending: boolean;
}

/**
 * Constants
 */

const DEBOUNCE_MS = 300;
const PAGE_SIZE = 25;

/**
 * Helpers
 */

const mapLocalToSearchItem = (r: SearchResult): SearchItem => ({
  id: r.id,
  title: r.title,
  artist: r.artist,
  coverUrl: r.thumbnail,
  year: '',
  genre: '',
});

/**
 * useAlbumSearch
 */

export const useAlbumSearch = (): UseAlbumSearchResult => {
  const { releases, musicSearch } = useRepositories();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ['album-search', debouncedQuery],
    queryFn: () =>
      searchAlbums(
        debouncedQuery,
        async q => {
          const local = await releases.findByQuery(q, 1, PAGE_SIZE);

          return local.results.map(mapLocalToSearchItem);
        },
        async q => musicSearch.search(q)
      ),
    enabled: debouncedQuery.length >= 2,
    placeholderData: prev => prev,
  });

  return {
    query,
    setQuery,
    results: data ?? [],
    isPending: isFetching,
  };
};
