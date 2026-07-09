import { formatListeningTime } from '../format-listening-time';

describe('formatListeningTime', () => {
  it('should format seconds into hours and minutes', () => {
    expect(formatListeningTime(0)).toBe('0m');
    expect(formatListeningTime(1800)).toBe('30m');
    expect(formatListeningTime(3600)).toBe('1h');
    expect(formatListeningTime(7384)).toBe('2h 3m');
    expect(formatListeningTime(31320)).toBe('8h 42m');
  });
});
