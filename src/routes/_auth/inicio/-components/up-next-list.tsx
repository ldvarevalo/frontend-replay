import type { FunctionComponent } from 'react';
import { Typography } from '#/components/ui/typography';
import type { Album } from '#/types/domain';

export interface UpNextListProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
}

export const UpNextList: FunctionComponent<UpNextListProps> = ({
  albums,
  onAlbumClick,
}) => (
  <div className="space-y-3">
    {albums.map(album => (
      <button
        key={album.id}
        type="button"
        onClick={() => onAlbumClick(album)}
        className="flex w-full items-center gap-3 rounded-sm border border-outline-variant bg-surface-container-low p-3 text-left transition-opacity hover:opacity-80"
      >
        <div className="size-14 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Typography
            family="heading"
            size="sm"
            weight="semibold"
            className="truncate"
          >
            {album.title}
          </Typography>
          <Typography
            size="xs"
            tracking="widest"
            uppercase
            className="truncate text-on-surface-variant"
          >
            {album.artist}
          </Typography>
        </div>
      </button>
    ))}
  </div>
);
