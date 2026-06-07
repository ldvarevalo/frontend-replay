/**
 * Types
 */

import type {
  Album,
  CollectionAlbum,
  CollectionStatus,
  HomeData,
  HomeStats,
  SearchResult,
  Track,
} from '#/types/domain';

export interface SearchResults {
  results: SearchResult[];
  totalPages: number;
}

export interface ReleasesRepository {
  findByQuery(
    query: string,
    page: number,
    pageSize: number
  ): Promise<SearchResults>;
}

export interface UserReleasesRepository {
  findHomeData(userId: string): Promise<HomeData>;
  findRecent(userId: string, limit: number): Promise<Album[]>;
  findAllByUser(userId: string): Promise<CollectionAlbum[]>;
  create(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void>;
}

export interface TracksRepository {
  findRecentByUser(userId: string, limit: number): Promise<Track[]>;
}

export interface StatsRepository {
  findStats(userId: string): Promise<HomeStats>;
}

/**
 * Constants
 */

export interface Repositories {
  releases: ReleasesRepository;
  userReleases: UserReleasesRepository;
  tracks: TracksRepository;
  stats: StatsRepository;
}
