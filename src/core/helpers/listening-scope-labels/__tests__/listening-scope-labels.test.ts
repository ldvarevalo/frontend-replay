import { getListeningScopeLabel } from '../listening-scope-labels';

/**
 * getListeningScopeLabel
 */

describe('getListeningScopeLabel', () => {
  it('should return the human label for known side values', () => {
    expect(getListeningScopeLabel('side_a')).toBe('Side A');
    expect(getListeningScopeLabel('side_b')).toBe('Side B');
    expect(getListeningScopeLabel('side_c')).toBe('Side C');
    expect(getListeningScopeLabel('side_d')).toBe('Side D');
  });

  it('should return the human label for full_release', () => {
    expect(getListeningScopeLabel('full_release')).toBe('Full Album');
  });

  it('should return the input string as fallback for unknown values', () => {
    expect(getListeningScopeLabel('unknown_side')).toBe('unknown_side');
  });

  it('should return the input string as fallback for empty string', () => {
    expect(getListeningScopeLabel('')).toBe('');
  });
});
