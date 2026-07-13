import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '#/core/auth';
import { useRepositories } from '#/repositories/hooks';
import type { CollectionAlbum, CollectionStatus } from '#/types/domain';

export interface CollectionData {
  albums: CollectionAlbum[];
  searchQuery: string;
  activeTab: string;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: string) => void;
  filteredAlbums: CollectionAlbum[];
}

const STATUS_MAP: Record<string, CollectionStatus> = {
  DISCOVER: 'discover',
  WANT: 'want',
  OWNED: 'owned',
};

export const useCollectionData = (
  initialTab: string = 'ALL'
): CollectionData => {
  const user = useUser();
  const { userReleases } = useRepositories();

  const { data: allAlbums = [] } = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: () => userReleases.findAllByUser(user!.id),
    enabled: !!user,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);

  const filteredAlbums = allAlbums.filter(album => {
    if (activeTab === 'LISTENED') {
      return album.isListened;
    }

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
