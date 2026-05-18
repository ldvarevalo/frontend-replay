import { render, screen } from '@test-utils';
import { StatsCard } from '../stats-card';

describe('StatsCard', () => {
  it('should render total releases and this month values', () => {
    render(<StatsCard totalReleases={1200} thisMonth={15} />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('TOTAL RELEASES')).toBeInTheDocument();
    expect(screen.getByText('THIS MONTH')).toBeInTheDocument();
  });
});
