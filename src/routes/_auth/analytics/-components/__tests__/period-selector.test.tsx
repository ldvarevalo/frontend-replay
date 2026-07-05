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
  it('should render all period options', () => {
    render(
      <PeriodSelector value="this-month" onChange={handlePeriodChangeMock} />
    );

    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
    expect(screen.getByText('This Year')).toBeInTheDocument();
    expect(screen.getByText('All Time')).toBeInTheDocument();
  });

  it('should highlight the active period', () => {
    render(
      <PeriodSelector value="this-month" onChange={handlePeriodChangeMock} />
    );

    expect(screen.getByText('This Month').closest('button')).toHaveClass(
      'bg-primary'
    );
  });

  it('should call onChange when a period is clicked', () => {
    render(
      <PeriodSelector value="this-month" onChange={handlePeriodChangeMock} />
    );

    screen.getByText('This Year').click();

    expect(handlePeriodChangeMock).toHaveBeenCalledWith('this-year');
  });
});
