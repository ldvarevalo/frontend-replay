import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRepositories } from '#/repositories/hooks';
import type { SearchResult } from '#/types/domain';

export interface UseSearchReleasesHook {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  toggleResult: (id: string) => void;
  addedIds: Set<string>;
}

const PAGE_SIZE = 4;

export const useSearchReleases = (): UseSearchReleasesHook => {
  const { releases } = useRepositories();

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedIds, setAddedIds] = useState(new Set<string>());

  const { data } = useQuery({
    queryKey: ['search-releases', query, currentPage],
    queryFn: () => releases.findByQuery(query, currentPage, PAGE_SIZE),
    enabled: query.length > 0,
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 1;

  const results = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.results.map(r => ({
      ...r,
      isAdded: addedIds.has(r.id),
    }));
  }, [data, addedIds]);

  const toggleResult = (id: string): void => {
    setAddedIds(prev => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return {
    query,
    setQuery,
    results,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleResult,
    addedIds,
  };
};
