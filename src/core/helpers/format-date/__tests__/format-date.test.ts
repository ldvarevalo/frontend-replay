import { formatDate } from '../format-date';

/**
 * formatDate
 */

describe('formatDate', () => {
  it('should format ISO date as "Mon DD, YYYY"', () => {
    expect(formatDate('2026-06-15T10:00:00Z')).toBe('Jun 15, 2026');
  });

  it('should format another date correctly', () => {
    expect(formatDate('2025-12-25T12:00:00Z')).toBe('Dec 25, 2025');
  });
});
