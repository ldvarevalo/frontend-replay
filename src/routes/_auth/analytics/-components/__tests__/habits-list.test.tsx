import { render, screen } from '@test-utils';
import { HabitsList } from '../habits-list';

/**
 * Tests
 */

describe('HabitsList', () => {
  it('should render all habits rows', () => {
    render(
      <HabitsList
        peakActivityDay="Sunday"
        averageSessionSeconds={2280}
        completionRate={72}
      />
    );

    expect(screen.getByText('Peak Activity')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('Average Session')).toBeInTheDocument();
    expect(screen.getByText('38m')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('Full Albums')).toBeInTheDocument();
  });
});
