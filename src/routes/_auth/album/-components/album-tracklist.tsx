import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import type { Track } from '#/types/domain';

/**
 * Types
 */

interface AlbumTracklistProps {
  tracks: Track[];
}

/**
 * AlbumTracklist
 */

export const AlbumTracklist: FunctionComponent<AlbumTracklistProps> = ({
  tracks,
}) => (
  <section className="space-y-2">
    <Typography
      size="xs"
      transform="uppercase"
      className="text-on-surface-variant"
    >
      TRACKLIST
    </Typography>
    {tracks.length === 0 ? (
      <div className="flex items-center justify-center bg-surface-container-high py-8">
        <Typography
          family="heading"
          size="md"
          className="text-center text-on-surface-variant"
        >
          No tracklist available. Import tracks from the menu or add them
          manually.
        </Typography>
      </div>
    ) : (
      <div className="bg-surface-container-high">
        {tracks.map(track => (
          <div
            key={track.id}
            className="flex items-center justify-between px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <Typography size="sm" className="text-on-surface-variant">
                {tracks.indexOf(track) + 1}
              </Typography>
              <div>
                <Typography size="sm" weight="medium">
                  {track.title}
                </Typography>
              </div>
            </div>
            <Typography size="sm" className="text-on-surface-variant">
              {track.duration}
            </Typography>
          </div>
        ))}
      </div>
    )}
  </section>
);
