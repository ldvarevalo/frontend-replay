import type {
  Album,
  AlbumDetail,
  CollectionAlbum,
  CollectionStatus,
  HomeStats,
  ListeningScope,
  ListeningSession,
  PriorityLevel,
  SearchResult,
  SourceFormat,
  Track,
} from '#/types/domain';

/**
 * Types
 */

export type ArtistRole = 'primary' | 'featured' | 'remixer';

export interface LookupResult {
  id: string;
  name: string;
  thumbnail?: string;
  subtitle?: string;
}

export interface SearchResults {
  results: SearchResult[];
  totalPages: number;
}

export interface SearchItem {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: string;
  genre: string;
}

export interface MusicSearchRepository {
  search(query: string): Promise<SearchItem[]>;
}

export interface ReleasesRepository {
  findByQuery(
    query: string,
    page: number,
    pageSize: number
  ): Promise<SearchResults>;
  create(data: {
    title: string;
    coverUrl?: string;
    releaseYear?: string;
  }): Promise<string>;
  linkArtist(
    releaseId: string,
    artistId: string,
    role?: ArtistRole
  ): Promise<void>;
  linkGenre(releaseId: string, genreId: string): Promise<void>;
  findById(id: string, userId?: string): Promise<AlbumDetail>;
}

export interface ArtistsRepository {
  findByName(name: string): Promise<string | null>;
  create(name: string): Promise<string>;
  search(query: string): Promise<LookupResult[]>;
}

export interface GenresRepository {
  findByName(name: string): Promise<string | null>;
  create(name: string): Promise<string>;
  search(query: string): Promise<LookupResult[]>;
}

export interface UserReleasesRepository {
  findRecent(userId: string, limit: number): Promise<Album[]>;
  findUpNext(userId: string, limit: number): Promise<Album[]>;
  findAllByUser(userId: string): Promise<CollectionAlbum[]>;
  create(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void>;
  upsert(data: {
    userId: string;
    releaseId: string;
    status: CollectionStatus;
  }): Promise<void>;
  findByRelease(
    releaseId: string,
    userId: string
  ): Promise<{ id: string } | null>;
  markAsListened(userReleaseId: string): Promise<void>;
  updatePriority(
    releaseId: string,
    userId: string,
    priority: PriorityLevel
  ): Promise<void>;
}

export interface TrackInput {
  title: string;
  durationSeconds: number | null;
  side: string;
  position: number;
}

export interface TracksRepository {
  findRecentByUser(userId: string, limit: number): Promise<Track[]>;
  createMany(releaseId: string, tracks: TrackInput[]): Promise<void>;
  findByRelease(releaseId: string): Promise<Track[]>;
}

export interface StatsRepository {
  findStats(userId: string): Promise<HomeStats>;
}

export interface ListeningSessionsRepository {
  create(data: {
    userReleaseId: string;
    scope: ListeningScope;
    sourceFormat: SourceFormat;
    durationSeconds: number | null;
  }): Promise<void>;

  findByRelease(releaseId: string, userId: string): Promise<ListeningSession[]>;
}

/**
 * Constants
 */

export interface Repositories {
  releases: ReleasesRepository;
  musicSearch: MusicSearchRepository;
  userReleases: UserReleasesRepository;
  tracks: TracksRepository;
  stats: StatsRepository;
  artists: ArtistsRepository;
  genres: GenresRepository;
  sessions: ListeningSessionsRepository;
}
