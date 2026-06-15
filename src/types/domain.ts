/**
 * Types
 */

export type CollectionStatus = 'discover' | 'want' | 'owned';

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
  wantToBuy: number;
}

export interface HomeData {
  stats: HomeStats;
  albums: Album[];
  upNext: Album[];
}

export interface CollectionAlbum {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  year: string;
  status: CollectionStatus;
  isListened: boolean;
}

export interface AlbumDetail {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  tracks: Track[];
  status: CollectionStatus | null;
  isListened: boolean;
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

export type ListeningScope =
  | 'full_release'
  | 'side_a'
  | 'side_b'
  | 'side_c'
  | 'side_d';

export type SourceFormat = 'vinyl' | 'digital';

export interface ListeningSession {
  id: string;
  userReleaseId: string;
  scope: ListeningScope;
  sourceFormat: SourceFormat;
  durationSeconds: number | null;
  listenedAt: string;
  createdAt: string;
}
