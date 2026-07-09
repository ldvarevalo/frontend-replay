import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';

/**
 * Types
 */

export interface UseDominantColorHook {
  hex: string | null;
  isDark: boolean | null;
  isLight: boolean | null;
  isLoading: boolean;
}

/**
 * useDominantColor
 */

export const useDominantColor = (
  imageUrl: string | null | undefined
): UseDominantColorHook => {
  const [hex, setHex] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [isLight, setIsLight] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);

      return;
    }

    let cancelled = false;
    const fac = new FastAverageColor();
    const img = new Image();

    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) {
        fac.destroy();

        return;
      }

      try {
        const color = fac.getColor(img);

        if (!cancelled) {
          setHex(color.hex);
          setIsDark(color.isDark);
          setIsLight(color.isLight);
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }

      fac.destroy();
    };

    img.onerror = () => {
      if (!cancelled) {
        setIsLoading(false);
      }

      fac.destroy();
    };

    img.src = imageUrl;

    return () => {
      cancelled = true;
      fac.destroy();
    };
  }, [imageUrl]);

  return {
    hex,
    isDark,
    isLight,
    isLoading,
  };
};
