import { render, screen } from '@test-utils';
import { PeriodSelector } from '../period-selector';

/**
 * Mocks
 */

const handlePeriodChangeMock = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * Tests
 */

describe('PeriodSelector', () => {
  it('should render trigger with current period label', () => {
    render(
      <PeriodSelector
        value="this-month"
        onChange={handlePeriodChangeMock}
      />
    );

    expect(screen.getByText('This Month')).toBeInTheDocument();
  });
});
