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
  findByTitleAndArtist: vi.fn().mockResolvedValue(null),
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
  create: vi.fn().mockResolvedValue(undefined),
};

const mockEntry: ManualEntryData = {
  title: 'Test Album',
  artist: 'Test Artist',
  year: '2024',
  genre: 'Jazz',
  artworkUrl: 'https://example.com/cover.jpg',
  status: 'want',
};

const mockEntryNoGenre: ManualEntryData = {
  title: 'Test Album',
  artist: 'Test Artist',
  year: '',
  genre: '',
  artworkUrl: '',
  status: 'want',
};

/**
 * Tests
 */

describe('useCreateManualRelease', () => {
  beforeEach(() => {
    setRepositories(
      createTestRepositories({
        releases: mockReleases,
        artists: mockArtists,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call repositories in correct order on mutate', async () => {
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
    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntryNoGenre);

    expect(mockGenres.findByName).not.toHaveBeenCalled();
    expect(mockGenres.create).not.toHaveBeenCalled();
    expect(mockReleases.linkGenre).not.toHaveBeenCalled();
  });

  it('should call findByName when artist already exists', async () => {
    const findByName = vi.fn().mockResolvedValue(mockArtistId);

    setRepositories(
      createTestRepositories({
        releases: mockReleases,
        artists: {
          ...mockArtists,
          findByName,
        },
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntry);

    expect(findByName).toHaveBeenCalledWith('Test Artist');
    expect(mockArtists.create).not.toHaveBeenCalled();
  });

  it('should reuse existing release without calling create when findByTitleAndArtist returns id', async () => {
    const existingReleaseId = 'release-existing-1';
    const findByTitleAndArtist = vi.fn().mockResolvedValue(existingReleaseId);

    setRepositories(
      createTestRepositories({
        releases: {
          ...mockReleases,
          findByTitleAndArtist,
        },
        artists: mockArtists,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntry);

    expect(findByTitleAndArtist).toHaveBeenCalledWith(
      'Test Album',
      'Test Artist'
    );
    expect(mockReleases.create).not.toHaveBeenCalled();
    expect(mockReleases.linkArtist).not.toHaveBeenCalled();
    expect(mockReleases.linkGenre).not.toHaveBeenCalled();
    expect(mockUserReleases.create).toHaveBeenCalledWith({
      userId: expect.any(String),
      releaseId: existingReleaseId,
      status: 'want',
    });
  });

  it('should trim title and artist before calling findByTitleAndArtist', async () => {
    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync({
      ...mockEntry,
      title: '  Test Album  ',
      artist: '  Test Artist  ',
    });

    expect(mockReleases.findByTitleAndArtist).toHaveBeenCalledWith(
      'Test Album',
      'Test Artist'
    );
  });

  it('should skip user_releases create when user already has the release', async () => {
    const existingReleaseId = 'release-existing-2';
    const findByTitleAndArtist = vi.fn().mockResolvedValue(existingReleaseId);
    const findByRelease = vi.fn().mockResolvedValue({ id: 'user-release-1' });

    setRepositories(
      createTestRepositories({
        releases: {
          ...mockReleases,
          findByTitleAndArtist,
        },
        artists: mockArtists,
        genres: mockGenres,
        userReleases: {
          ...mockUserReleases,
          findByRelease,
        },
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    await result.current.mutateAsync(mockEntry);

    expect(findByRelease).toHaveBeenCalledWith(
      existingReleaseId,
      expect.any(String)
    );
    expect(mockUserReleases.create).not.toHaveBeenCalled();
  });

  it('should return reused=false and the new releaseId when creating a new release', async () => {
    const { result } = renderHook(() => useCreateManualRelease());

    const returned = await result.current.mutateAsync(mockEntry);

    expect(returned).toEqual({
      releaseId: mockReleaseId,
      reused: false,
    });
  });

  it('should return reused=true and the existing releaseId when reusing', async () => {
    const existingReleaseId = 'release-existing-3';
    const findByTitleAndArtist = vi.fn().mockResolvedValue(existingReleaseId);

    setRepositories(
      createTestRepositories({
        releases: {
          ...mockReleases,
          findByTitleAndArtist,
        },
        artists: mockArtists,
        genres: mockGenres,
        userReleases: mockUserReleases,
      })
    );

    const { result } = renderHook(() => useCreateManualRelease());

    const returned = await result.current.mutateAsync(mockEntry);

    expect(returned).toEqual({
      releaseId: existingReleaseId,
      reused: true,
    });
  });
});
