import { render, screen } from '@test-utils';

import type { BacklogEntry } from '#/types/domain';

import { DiscoverBacklogCard } from '../discover-backlog-card';

/**
 * Mocks
 */

const handleNavigateToDiscoverMock = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Tests
 */

describe('DiscoverBacklogCard', () => {
  const OLDEST_ENTRY_MOCK: BacklogEntry = {
    coverUrl: 'A.COVER.URL',
    title: 'A.ALBUM.TITLE',
    artist: 'AN.ARTIST.NAME',
    daysSinceAdded: 42,
  };

  it('should render backlog count', () => {
    render(
      <DiscoverBacklogCard
        count={23}
        oldestEntry={OLDEST_ENTRY_MOCK}
        onNavigateToDiscover={handleNavigateToDiscoverMock}
      />
    );

    expect(screen.getByText('23')).toBeInTheDocument();
    expect(screen.getByText('albums waiting to be discovered')).toBeInTheDocument();
  });

  it('should render oldest entry info', () => {
    render(
      <DiscoverBacklogCard
        count={23}
        oldestEntry={OLDEST_ENTRY_MOCK}
        onNavigateToDiscover={handleNavigateToDiscoverMock}
      />
    );

    expect(screen.getByText('A.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
    expect(screen.getByText(/42 days ago/)).toBeInTheDocument();
  });

  it('should call onNavigateToDiscover when clicked', () => {
    render(
      <DiscoverBacklogCard
        count={23}
        oldestEntry={OLDEST_ENTRY_MOCK}
        onNavigateToDiscover={handleNavigateToDiscoverMock}
      />
    );

    screen.getByText('23').closest('div')!.click();

    expect(handleNavigateToDiscoverMock).toHaveBeenCalledTimes(1);
  });

  it('should render without oldest entry', () => {
    render(
      <DiscoverBacklogCard
        count={0}
        oldestEntry={undefined}
        onNavigateToDiscover={handleNavigateToDiscoverMock}
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.queryByText('Oldest entry')).not.toBeInTheDocument();
  });
});
