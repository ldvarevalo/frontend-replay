import { useSearch } from '@tanstack/react-router';
import type { Mock } from 'vitest';
import { renderHook } from '@test-utils';
import { useCollectionData } from '../use-collection-data';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    useSearch: vi.fn(),
  };
});

describe('useCollectionData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set activeTab from want search param', () => {
    (useSearch as Mock).mockReturnValue({ want: '' });

    const { result } = renderHook(() => useCollectionData());

    expect(result.current.activeTab).toBe('WANT');
  });

  it('should default to ALL when no want param', () => {
    (useSearch as Mock).mockReturnValue({});

    const { result } = renderHook(() => useCollectionData());

    expect(result.current.activeTab).toBe('ALL');
  });
});
