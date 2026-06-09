/**
 * Types
 */

export type CollectionStatus = 'owned' | 'want' | 'listened';

export interface Album {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
}

export interface Track {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
  duration: string;
  isActive?: boolean;
}

export interface HomeStats {
  totalReleases: number;
  thisMonth: number;
  wantToListen: number;
}

export interface HomeData {
  stats: HomeStats;
  albums: Album[];
  tracks: Track[];
}

export interface CollectionAlbum {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  year: string;
  status: CollectionStatus;
}

export interface SearchResult {
  id: string;
  thumbnail: string;
  title: string;
  artist: string;
  isAdded: boolean;
}

export interface ManualEntryData {
  title: string;
  artist: string;
  year: string;
  genre: string;
  artworkUrl: string;
  status: CollectionStatus;
}
