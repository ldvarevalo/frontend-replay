import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { CollectionAlbum } from '#/types/domain';

type CollectionStatus = 'owned' | 'want' | 'listened';

export interface CollectionData {
  albums: CollectionAlbum[];
  searchQuery: string;
  activeTab: string;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: string) => void;
  filteredAlbums: CollectionAlbum[];
}

const STATUS_MAP: Record<string, CollectionStatus> = {
  OWNED: 'owned',
  WANT: 'want',
  LISTENED: 'listened',
};

export const useCollectionData = (): CollectionData => {
  const user = useUser();
  const { userReleases } = useRepositories();

  const { data: allAlbums = [] } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => userReleases.findAllByUser(user!.id),
    enabled: !!user,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredAlbums = allAlbums.filter(album => {
    const matchesTab =
      activeTab === 'ALL' || album.status === STATUS_MAP[activeTab];

    const q = searchQuery.toLowerCase();

    const matchesSearch =
      !q ||
      album.title.toLowerCase().includes(q) ||
      album.artist.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return {
    albums: allAlbums,
    searchQuery,
    activeTab,
    setSearchQuery,
    setActiveTab,
    filteredAlbums,
  };
};
