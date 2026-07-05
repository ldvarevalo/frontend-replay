import { render, screen } from '@test-utils';
import { AnalyticsEmptyState } from '../analytics-empty-state';

/**
 * Mocks
 */

const handleLogFirstSessionMock = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Tests
 */

describe('AnalyticsEmptyState', () => {
  it('should render empty state message and CTA', () => {
    render(
      <AnalyticsEmptyState onLogFirstSession={handleLogFirstSessionMock} />
    );

    expect(screen.getByText('No listening data yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Start logging listening sessions/)
    ).toBeInTheDocument();
    expect(screen.getByText('Log your first session')).toBeInTheDocument();
  });

  it('should call onLogFirstSession when CTA is clicked', () => {
    render(
      <AnalyticsEmptyState onLogFirstSession={handleLogFirstSessionMock} />
    );

    screen.getByText('Log your first session').click();

    expect(handleLogFirstSessionMock).toHaveBeenCalledTimes(1);
  });
});
