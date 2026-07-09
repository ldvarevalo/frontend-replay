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
  it('should render trigger with calendar icon', () => {
    render(
      <PeriodSelector value="this-month" onChange={handlePeriodChangeMock} />
    );

    const trigger = screen.getByRole('combobox');

    expect(trigger.querySelector('.lucide-calendar')).toBeInTheDocument();
  });
});
