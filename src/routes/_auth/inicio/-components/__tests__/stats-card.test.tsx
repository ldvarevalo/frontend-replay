import { render, screen } from '@test-utils';
import { StatsCard } from '../stats-card';

describe('StatsCard', () => {
  it('should render collection count and listening hours', () => {
    render(<StatsCard collectionCount={1200} listeningHours={8} />);

    expect(screen.getByText('1,200 albums')).toBeInTheDocument();
    expect(screen.getByText('8h listening')).toBeInTheDocument();
    expect(screen.getByText('Collection')).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();
  });
});
