import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LookupResult } from '#/repositories/types';

/** Types */

interface UseSearchLookupProps {
  searchFn: (query: string) => Promise<LookupResult[]>;
  debounceMs?: number;
}

interface UseSearchLookupReturn {
  results: LookupResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
}

/** useSearchLookup */

export const useSearchLookup = ({
  searchFn,
  debounceMs = 300,
}: UseSearchLookupProps): UseSearchLookupReturn => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs]);

  const { data, isFetching } = useQuery({
    queryKey: ['search-lookup', debouncedQuery],
    queryFn: () => searchFn(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    results: data ?? [],
    isSearching: isFetching,
    onSearch: setQuery,
  };
};
