import { useState } from 'react';

import type {
  CollectionAlbum,
  CollectionStatus,
} from '#/types/domain';

/**
 * Types
 */

export interface CollectionData {
  albums: CollectionAlbum[];
  searchQuery: string;
  activeTab: string;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: string) => void;
  filteredAlbums: CollectionAlbum[];
}

/**
 * Constants
 */

const STATUS_MAP: Record<string, CollectionStatus> = {
  WANT: 'want',
  LISTENING: 'listening',
  LISTENED: 'listened',
};

const MOCK_ALBUMS: CollectionAlbum[] = [
  {
    id: '1',
    coverUrl: 'https://picsum.photos/seed/album1/400',
    title: 'Dark Side',
    artist: 'Pink Floyd',
    year: '1973',
    status: 'owned',
  },
  {
    id: '2',
    coverUrl: 'https://picsum.photos/seed/album2/400',
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    year: '1977',
    status: 'owned',
  },
  {
    id: '3',
    coverUrl: 'https://picsum.photos/seed/album3/400',
    title: 'Thriller',
    artist: 'Michael Jackson',
    year: '1982',
    status: 'want',
  },
  {
    id: '4',
    coverUrl: 'https://picsum.photos/seed/album4/400',
    title: 'Back in Black',
    artist: 'AC/DC',
    year: '1980',
    status: 'owned',
  },
  {
    id: '5',
    coverUrl: 'https://picsum.photos/seed/album5/400',
    title: 'Nevermind',
    artist: 'Nirvana',
    year: '1991',
    status: 'listening',
  },
  {
    id: '6',
    coverUrl: 'https://picsum.photos/seed/album6/400',
    title: 'OK Computer',
    artist: 'Radiohead',
    year: '1997',
    status: 'owned',
  },
  {
    id: '7',
    coverUrl: 'https://picsum.photos/seed/album7/400',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    year: '1959',
    status: 'listened',
  },
  {
    id: '8',
    coverUrl: 'https://picsum.photos/seed/album8/400',
    title: 'Channel Orange',
    artist: 'Frank Ocean',
    year: '2012',
    status: 'want',
  },
];

/**
 * UseCollectionData
 */

export const useCollectionData = (): CollectionData => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredAlbums = MOCK_ALBUMS.filter(album => {
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
    albums: MOCK_ALBUMS,
    searchQuery,
    activeTab,
    setSearchQuery,
    setActiveTab,
    filteredAlbums,
  };
};
