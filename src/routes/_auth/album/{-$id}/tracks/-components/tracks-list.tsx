import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import { formatDuration } from '#/core/helpers/format-duration';
import { getListeningScopeLabel } from '#/core/helpers/listening-scope-labels';
import { sumTrackDurations } from '#/core/helpers/tracks-by-side';
import type { Track } from '#/types/domain';

/**
 * Types
 */

interface TracksListProps {
  bySide: Record<string, Track[]>;
}

/**
 * TracksList
 */

export const TracksList: FunctionComponent<TracksListProps> = ({ bySide }) => {
  const sides = Object.keys(bySide);

  if (sides.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sides.map(side => {
        const tracks = bySide[side];
        const totalDuration = sumTrackDurations(tracks);
        const label = getListeningScopeLabel(side);

        return (
          <section key={side} className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <Typography
                size="xs"
                weight="bold"
                transform="uppercase"
                tracking="widest"
                className="text-on-surface-variant"
              >
                {label}
              </Typography>
              <Typography
                size="xs"
                className="text-on-surface-variant"
              >
                {formatDuration(totalDuration)}
              </Typography>
            </div>

            <div className="bg-surface-container-high">
              {tracks.map(track => (
                <div
                  key={track.id}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Typography size="sm" className="text-on-surface-variant">
                      {track.position}
                    </Typography>
                    <Typography size="sm" weight="medium">
                      {track.title}
                    </Typography>
                  </div>
                  <Typography size="sm" className="text-on-surface-variant">
                    {formatDuration(track.durationSeconds)}
                  </Typography>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
