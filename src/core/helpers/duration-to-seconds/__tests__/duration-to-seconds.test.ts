import { durationToSeconds } from '../duration-to-seconds';

/**
 * durationToSeconds
 */

describe('durationToSeconds', () => {
  it('should return null for empty string', () => {
    expect(durationToSeconds('')).toBeNull();
  });

  it('should return null for undefined', () => {
    expect(durationToSeconds(undefined)).toBeNull();
  });

  it('should parse 6-digit format "004357" to 2637 seconds', () => {
    expect(durationToSeconds('004357')).toBe(2637);
  });

  it('should parse 6-digit format "100000" to 36000 seconds', () => {
    expect(durationToSeconds('100000')).toBe(36000);
  });

  it('should parse 6-digit format "000001" to 1 second', () => {
    expect(durationToSeconds('000001')).toBe(1);
  });

  it('should parse 6-digit format "235959" to 86399 seconds', () => {
    expect(durationToSeconds('235959')).toBe(86399);
  });

  it('should parse HH:MM:SS format "00:43:57" to 2637 seconds', () => {
    expect(durationToSeconds('00:43:57')).toBe(2637);
  });

  it('should parse HH:MM:SS format "12:34:56" to 45296 seconds', () => {
    expect(durationToSeconds('12:34:56')).toBe(45296);
  });

  it('should return null for non-numeric input', () => {
    expect(durationToSeconds('abcdef')).toBeNull();
  });

  it('should return null for input with fewer than 6 digits', () => {
    expect(durationToSeconds('12345')).toBeNull();
  });

  it('should return null for input with more than 6 digits', () => {
    expect(durationToSeconds('1234567')).toBeNull();
  });
});
