import { useState, useMemo } from 'react';

import type { SearchResult } from '#/types/domain';

/**
 * Types
 */

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

/**
 * Constants
 */

const PAGE_SIZE = 4;

const MOCK_RESULTS: Omit<SearchResult, 'isAdded'>[] = [
  {
    id: 'r1',
    thumbnail: 'https://picsum.photos/seed/release1/200',
    title: 'A Love Supreme',
    artist: 'John Coltrane',
  },
  {
    id: 'r2',
    thumbnail: 'https://picsum.photos/seed/release2/200',
    title: 'Blue Train',
    artist: 'John Coltrane',
  },
  {
    id: 'r3',
    thumbnail: 'https://picsum.photos/seed/release3/200',
    title: 'Giant Steps',
    artist: 'John Coltrane',
  },
  {
    id: 'r4',
    thumbnail: 'https://picsum.photos/seed/release4/200',
    title: 'My Favorite Things',
    artist: 'John Coltrane',
  },
  {
    id: 'r5',
    thumbnail: 'https://picsum.photos/seed/release5/200',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
  },
  {
    id: 'r6',
    thumbnail: 'https://picsum.photos/seed/release6/200',
    title: 'Bitches Brew',
    artist: 'Miles Davis',
  },
  {
    id: 'r7',
    thumbnail: 'https://picsum.photos/seed/release7/200',
    title: 'Sketches of Spain',
    artist: 'Miles Davis',
  },
  {
    id: 'r8',
    thumbnail: 'https://picsum.photos/seed/release8/200',
    title: 'Round About Midnight',
    artist: 'Miles Davis',
  },
  {
    id: 'r9',
    thumbnail: 'https://picsum.photos/seed/release9/200',
    title: 'Maiden Voyage',
    artist: 'Herbie Hancock',
  },
  {
    id: 'r10',
    thumbnail: 'https://picsum.photos/seed/release10/200',
    title: 'Head Hunters',
    artist: 'Herbie Hancock',
  },
];

/**
 * UseSearchReleases
 */

export const useSearchReleases = (): UseSearchReleasesHook => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedIds, setAddedIds] = useState(new Set<string>());

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) {
      return [];
    }
    return MOCK_RESULTS.filter(
      r =>
        r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);

  const results = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE).map(r => ({
      ...r,
      isAdded: addedIds.has(r.id),
    }));
  }, [filtered, clampedPage, addedIds]);

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
    currentPage: clampedPage,
    totalPages,
    setCurrentPage,
    toggleResult,
    addedIds,
  };
};
