/**
 * Helpers
 */

export const durationToSeconds = (
  duration: string | undefined
): number | null => {
  if (!duration) {
    return null;
  }

  const digits = duration.replace(/\D/g, '');

  if (digits.length !== 6) {
    return null;
  }

  const h = Number(digits.slice(0, 2));
  const m = Number(digits.slice(2, 4));
  const s = Number(digits.slice(4, 6));

  if ([h, m, s].some(isNaN)) {
    return null;
  }

  return h * 3600 + m * 60 + s;
};
