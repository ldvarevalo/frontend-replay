import { renderWithAuth, screen } from '@test-utils';
import type { AuthUser } from '#/core/auth/types';
import { createTestRepositories } from '#/repositories/__tests__/test-repositories';
import { setRepositories } from '#/repositories/instance';
import { HomePage } from '../index';

const TEST_USER: AuthUser = {
  id: 'test-user',
  email: 'test@test.com',
};

const MOCK_STATS = {
  totalReleases: 100,
  listeningTimeHours: 5,
  wantToBuy: 3,
};

const MOCK_DAILY_PICK = {
  id: 'A.DAILY.PICK.ID',
  coverUrl: '',
  title: 'A.DAILY.PICK.TITLE',
  artist: 'AN.ARTIST.NAME',
  createdAt: '2024-01-01T00:00:00Z',
};

const MOCK_ALBUMS = [
  {
    id: 'A.RECENT.ONE',
    coverUrl: '',
    title: 'A.RECENT.ALBUM',
    artist: 'AN.ARTIST',
    listenedAt: '2024-06-01T00:00:00Z',
  },
];

const MOCK_REDISCOVER = {
  id: 'A.REDISCOVER.ID',
  coverUrl: '',
  title: 'AN.OLD.ALBUM',
  artist: 'AN.OLD.ARTIST',
};

const MOCK_UP_NEXT = [
  {
    id: 'A.UP.NEXT.ONE',
    coverUrl: '',
    title: 'AN.UP.NEXT',
    artist: 'AN.ARTIST',
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    const repos = createTestRepositories();

    setRepositories({
      ...repos,
      stats: { findStats: async () => MOCK_STATS },
      userReleases: {
        ...repos.userReleases,
        findRecent: async () => MOCK_ALBUMS,
        findDailyPick: async () => MOCK_DAILY_PICK,
        findOldestListened: async () => MOCK_REDISCOVER,
        findUpNext: async () => MOCK_UP_NEXT,
      },
    });
  });

  it('should render Daily Pick section when dailyPick exists', async () => {
    renderWithAuth(<HomePage />, TEST_USER);

    expect(await screen.findByText("Today's Pick")).toBeInTheDocument();
    expect(screen.getByText('A.DAILY.PICK.TITLE')).toBeInTheDocument();
  });

  it('should render Recently Listened section', async () => {
    renderWithAuth(<HomePage />, TEST_USER);

    expect(await screen.findByText('Recently Listened')).toBeInTheDocument();
    expect(screen.getByText('A.RECENT.ALBUM')).toBeInTheDocument();
  });

  it('should render Rediscover section', async () => {
    renderWithAuth(<HomePage />, TEST_USER);

    expect(await screen.findByText('Rediscover')).toBeInTheDocument();
    expect(screen.getByText('AN.OLD.ALBUM')).toBeInTheDocument();
  });

  it('should render Up Next section', async () => {
    renderWithAuth(<HomePage />, TEST_USER);

    expect(await screen.findByText('Up Next')).toBeInTheDocument();
    expect(screen.getByText('AN.UP.NEXT')).toBeInTheDocument();
  });
});
