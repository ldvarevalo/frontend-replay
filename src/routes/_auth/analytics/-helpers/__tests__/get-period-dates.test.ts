import { getPeriodDates } from '../get-period-dates';

describe('getPeriodDates', () => {
  it('should return start of current month for this-month', () => {
    const { start, end } = getPeriodDates('this-month');
    const startDate = new Date(start);
    expect(startDate.getDate()).toBe(1);
    expect(startDate.getHours()).toBe(0);
    expect(new Date(end).getTime()).toBeGreaterThan(0);
  });

  it('should return all-time with epoch start', () => {
    const { start } = getPeriodDates('all-time');
    expect(start).toBe('1970-01-01T00:00:00Z');
  });
});
