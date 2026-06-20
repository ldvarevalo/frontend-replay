import { useMemo } from 'react';
import {
  groupTracksBySide,
  sumTrackDurations,
} from '#/core/helpers/tracks-by-side';
import type { Track } from '#/types/domain';

/**
 * Types
 */

export interface UseTracksBySideHook {
  bySide: Record<string, Track[]>;
  totalCount: number;
  totalDurationSeconds: number;
  sideSummaries: Record<string, { count: number; durationSeconds: number }>;
}

/**
 * useTracksBySide
 */

export const useTracksBySide = (tracks: Track[]): UseTracksBySideHook => {
  const bySide = useMemo(() => groupTracksBySide(tracks), [tracks]);

  const totalCount = tracks.length;

  const totalDurationSeconds = useMemo(
    () => sumTrackDurations(tracks),
    [tracks]
  );

  const sideSummaries = useMemo(() => {
    const summaries: Record<
      string,
      { count: number; durationSeconds: number }
    > = {};

    for (const side of Object.keys(bySide)) {
      summaries[side] = {
        count: bySide[side].length,
        durationSeconds: sumTrackDurations(bySide[side]),
      };
    }

    return summaries;
  }, [bySide]);

  return {
    bySide,
    totalCount,
    totalDurationSeconds,
    sideSummaries,
  };
};
