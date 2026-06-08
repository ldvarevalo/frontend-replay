import { renderHook } from '@test-utils';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
import { setRepositories } from '#/repositories/instance';
import type { ManualEntryData } from '#/types/domain';
import { useCreateManualRelease } from '../use-create-manual-release';

/**
 * Mocks
 */

vi.mock('#/core/auth/auth-context', async () => {
  const actual = await vi.importActual('#/core/auth/auth-context');

  return {
    ...actual,
    useUser: () => ({ id: 'auth-user-1',
email: 'test@example.com' }),
  };
});

const mockReleaseId = 'release-uuid-1';
const mockArtistId = 'artist-uuid-1';
const mockGenreId = 'genre-uuid-1';

const mockReleases = {
  findByQuery: async () => ({ results: [],
totalPages: 0 }),
  create: vi.fn().mockResolvedValue(mockReleaseId),
  linkArtist: vi.fn().mockResolvedValue(undefined),
  linkGenre: vi.fn().mockResolvedValue(undefined),
};

const mockArtists = {
  findByName: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue(mockArtistId),
};

const mockGenres = {
  findByName: vi.fn().mockResolvedValue(null),
  create: vi.fn().mockResolvedValue(mockGenreId),
};

const mockUserReleases = {
  findRecent: vi.fn().mockResolvedValue([]),
  findAllByUser: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockResolvedValue(undefined),
};

const mockEntry: ManualEntryData = {
  title: 'Test Album',
  artist: 'Test Artist',
  year: '2024',
  genre: 'Jazz',
  artworkUrl: 'https://example.com/cover.jpg',
};

const mockEntryNoGenre: ManualEntryData = {
  title: 'Test Album',
  artist: 'Test Artist',
  year: '',
  genre: '',
  artworkUrl: '',
};

/**
 * Tests
 */

describe('useCreateManualRelease', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call repositories in correct order on mutate', async () => {
    setRepositories(
      createTestRepositories({
        releases: mockReleases,
        artists: mockArtists,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntry);

    expect(mockReleases.create).toHaveBeenCalledWith({
      title: 'Test Album',
      coverUrl: 'https://example.com/cover.jpg',
      releaseYear: '2024',
    });

    expect(mockArtists.create).toHaveBeenCalledWith('Test Artist');

    expect(mockReleases.linkArtist).toHaveBeenCalledWith(
      mockReleaseId,
      mockArtistId
    );

    expect(mockGenres.create).toHaveBeenCalledWith('Jazz');

    expect(mockReleases.linkGenre).toHaveBeenCalledWith(
      mockReleaseId,
      mockGenreId
    );

    expect(mockUserReleases.create).toHaveBeenCalledWith({
      userId: expect.any(String),
      releaseId: mockReleaseId,
      status: 'want',
    });
  });

  it('should skip genre when genre is empty', async () => {
    setRepositories(
      createTestRepositories({
        releases: mockReleases,
        artists: mockArtists,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntryNoGenre);

    expect(mockGenres.findByName).not.toHaveBeenCalled();
    expect(mockGenres.create).not.toHaveBeenCalled();
    expect(mockReleases.linkGenre).not.toHaveBeenCalled();
  });

  it('should call findByName when artist already exists', async () => {
    const artistsWithExisting = {
      ...mockArtists,
      findByName: vi.fn().mockResolvedValue(mockArtistId),
    };

    setRepositories(
      createTestRepositories({
        releases: mockReleases,
        artists: artistsWithExisting,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntry);

    expect(artistsWithExisting.findByName).toHaveBeenCalledWith('Test Artist');
    expect(artistsWithExisting.create).not.toHaveBeenCalled();
  });
});
