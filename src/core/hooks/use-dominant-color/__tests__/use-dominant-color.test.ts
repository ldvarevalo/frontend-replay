import { renderHook, waitFor } from '@test-utils';

import { useDominantColor } from '..';

/**
 * Mocks
 */

vi.mock('fast-average-color', () => {
  const getColor = vi.fn(() => ({
    hex: '#ff0000',
    isDark: true,
    isLight: false,
    value: [255, 0, 0, 255],
  }));

  const destroy = vi.fn();

  return {
    FastAverageColor: vi.fn(() => ({
      getColor,
      destroy,
    })),
  };
});

/**
 * Helpers
 */

const mockImage = (shouldSucceed: boolean): void => {
  let onloadHandler: (() => void) | null = null;
  let onerrorHandler: (() => void) | null = null;

  vi.stubGlobal(
    'Image',
    vi.fn(() => ({
      set crossOrigin(_val: string) {},
      set onload(fn: (() => void) | null) {
        onloadHandler = fn;
      },
      get onload() {
        return onloadHandler;
      },
      set onerror(fn: (() => void) | null) {
        onerrorHandler = fn;
      },
      get onerror() {
        return onerrorHandler;
      },
      set src(_val: string) {
        setTimeout(() => {
          if (shouldSucceed) {
            onloadHandler?.();
          } else {
            onerrorHandler?.();
          }
        }, 0);
      },
    }))
  );
};

/**
 * Tests
 */

describe('useDominantColor', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('should return hex and isDark when image loads successfully', async () => {
    mockImage(true);

    const { result } = renderHook(() =>
      useDominantColor('https://example.com/cover.jpg')
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hex).toBeNull();
    expect(result.current.isDark).toBeNull();

    await waitFor(() => {
      expect(result.current.hex).toBe('#ff0000');
    });

    expect(result.current.isDark).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return null fields when image fails to load', async () => {
    mockImage(false);

    const { result } = renderHook(() =>
      useDominantColor('https://example.com/bad.jpg')
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hex).toBeNull();
    expect(result.current.isDark).toBeNull();
  });

  it('should return null values when imageUrl is null', () => {
    mockImage(true);

    const { result } = renderHook(() => useDominantColor(null));

    expect(result.current.hex).toBeNull();
    expect(result.current.isDark).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not set state after unmount', async () => {
    mockImage(true);

    const { result, unmount } = renderHook(() =>
      useDominantColor('https://example.com/cover.jpg')
    );

    expect(result.current.hex).toBeNull();

    unmount();

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(result.current.hex).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
