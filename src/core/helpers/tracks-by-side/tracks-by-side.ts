import type { Track } from '#/types/domain'

/**
 * groupTracksBySide
 */

export const groupTracksBySide = (
  tracks: Track[]
): Record<string, Track[]> => {
  const grouped: Record<string, Track[]> = {}

  for (const track of tracks) {
    if (!grouped[track.side]) {
      grouped[track.side] = []
    }
    grouped[track.side].push(track)
  }

  for (const side of Object.keys(grouped)) {
    grouped[side].sort((a, b) => a.position - b.position)
  }

  return grouped
}

/**
 * sumTrackDurations
 */

export const sumTrackDurations = (tracks: Track[]): number =>
  tracks.reduce((sum, t) => sum + (t.durationSeconds ?? 0), 0)
