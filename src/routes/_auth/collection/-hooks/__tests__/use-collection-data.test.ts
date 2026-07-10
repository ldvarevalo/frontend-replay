import { useSearchParams } from '@tanstack/react-router';
import type { Mock } from 'vitest';
import { renderHook, waitFor } from '@test-utils';
import { useCollectionData } from '../use-collection-data';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('useCollectionData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set activeTab from want search param', () => {
    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('want='),
      vi.fn(),
    ]);

    const { result } = renderHook(() => useCollectionData());

    expect(result.current.activeTab).toBe('WANT');
  });
});
