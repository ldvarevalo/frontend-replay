import { renderHook } from '@test-utils';
import { useCollectionData } from '../use-collection-data';

describe('useCollectionData', () => {
  it('should default to ALL when no initialTab provided', () => {
    const { result } = renderHook(() => useCollectionData());

    expect(result.current.activeTab).toBe('ALL');
  });

  it('should use initialTab when provided', () => {
    const { result } = renderHook(() => useCollectionData('WANT'));

    expect(result.current.activeTab).toBe('WANT');
  });
});
