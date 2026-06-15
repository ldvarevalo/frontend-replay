import type { FunctionComponent } from 'react';
import { AlbumCard } from '#/components/album-card';
import type { CollectionAlbum } from '#/types/domain';

/**
 * Types
 */

interface CollectionAlbumGridProps {
  albums: CollectionAlbum[];
  onAlbumClick: (id: string) => void;
}

/**
 * CollectionAlbumGrid
 */

export const CollectionAlbumGrid: FunctionComponent<
  CollectionAlbumGridProps
> = ({ albums, onAlbumClick }) => (
  <div className="grid grid-cols-2 gap-4">
    {albums.map(album => (
      <AlbumCard
        key={album.id}
        coverUrl={album.coverUrl}
        title={album.title}
        artist={album.artist}
        year={album.year}
        isListened={album.isListened}
        onClick={() => onAlbumClick(album.id)}
      />
    ))}
  </div>
);
