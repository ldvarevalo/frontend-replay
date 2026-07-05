import { render, screen } from '@test-utils';

import { MetricCards } from '../metric-cards';

/**
 * Tests
 */

describe('MetricCards', () => {
  it('should render four metrics with values', () => {
    render(
      <MetricCards
        listenedAlbums={12}
        listeningTimeSeconds={31320}
        addedToWant={4}
        markedOwned={2}
      />
    );

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8h 42m')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Albums listened')).toBeInTheDocument();
    expect(screen.getByText('Listening time')).toBeInTheDocument();
    expect(screen.getByText('Added to Want')).toBeInTheDocument();
    expect(screen.getByText('Marked Owned')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(
      <MetricCards
        listenedAlbums={0}
        listeningTimeSeconds={0}
        addedToWant={0}
        markedOwned={0}
      />
    );

    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0m')).toBeInTheDocument();
  });
});
