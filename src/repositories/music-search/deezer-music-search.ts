import type { MusicSearchRepository, SearchItem } from './types';

/**
 * Constants
 */

const MAX_GENRE_ENRICHMENT = 5;
const SEARCH_ENDPOINT = 'https://api.deezer.com/search/album';
const ALBUM_ENDPOINT = 'https://api.deezer.com/album';

/**
 * Types
 */

interface DeezerSearchAlbum {
  id: number;
  title: string;
  cover_big: string;
  release_date?: string;
  artist: { name: string };
}

interface DeezerSearchResponse {
  data?: DeezerSearchAlbum[];
}

interface DeezerAlbumResponse {
  genres?: Array<{ name: string }>;
}

/**
 * Helpers
 */

const toSearchItem = (a: DeezerSearchAlbum): SearchItem => ({
  id: String(a.id),
  title: a.title,
  artist: a.artist.name,
  coverUrl: a.cover_big,
  year: a.release_date ? a.release_date.slice(0, 4) : '',
  genre: '',
});

const enrichGenres = async (
  items: SearchItem[]
): Promise<SearchItem[]> => {
  const slice = items.slice(0, MAX_GENRE_ENRICHMENT);
  const results = await Promise.allSettled(
    slice.map(async item => {
      const res = await fetch(`${ALBUM_ENDPOINT}/${item.id}`);
      if (!res.ok) {
        return '';
      }
      const body = (await res.json()) as DeezerAlbumResponse;

      return body.genres?.[0]?.name ?? '';
    })
  );

  return items.map((item, index) => {
    if (index >= MAX_GENRE_ENRICHMENT) {
      return item;
    }
    const r = results[index];

    return {
      ...item,
      genre: r?.status === 'fulfilled' ? r.value : '',
    };
  });
};

/**
 * DeezerMusicSearchRepository
 */

export class DeezerMusicSearchRepository implements MusicSearchRepository {
  async search(query: string): Promise<SearchItem[]> {
    try {
      const res = await fetch(
        `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        return [];
      }

      const body = (await res.json()) as DeezerSearchResponse;
      const items = (body.data ?? []).map(toSearchItem);

      return enrichGenres(items);
    } catch {
      return [];
    }
  }
}
