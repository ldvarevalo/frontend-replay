import type { MusicSearchRepository, SearchItem } from './types';

/**
 * Constants
 */

const MAX_GENRE_ENRICHMENT = 5;
const SEARCH_ENDPOINT = '/api-deezer/search/album';
const ALBUM_ENDPOINT = '/api-deezer/album';

/**
 * Types
 */

interface DeezerSearchArtist {
  name: string;
}

interface DeezerSearchAlbum {
  id: number;
  title: string;
  cover_big: string;
  release_date?: string;
  artist: DeezerSearchArtist;
}

interface DeezerSearchResponse {
  data?: DeezerSearchAlbum[];
}

interface DeezerGenresResponse {
  id: string;
  name: string;
}

interface DeezerGenresDataResponse {
  data?: DeezerGenresResponse[];
}

interface DeezerAlbumResponse {
  release_date?: string;
  genres?: DeezerGenresDataResponse;
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

const enrichDetails = async (items: SearchItem[]): Promise<SearchItem[]> => {
  const slice = items.slice(0, MAX_GENRE_ENRICHMENT);
  const results = await Promise.allSettled(
    slice.map(async item => {
      const res = await fetch(`${ALBUM_ENDPOINT}/${item.id}`);
      if (!res.ok) {
        return {
          year: '',
          genre: '',
        };
      }
      const body = (await res.json()) as DeezerAlbumResponse;

      return {
        year: body.release_date ? body.release_date.slice(0, 4) : '',
        genre: body.genres?.data?.[0].name ?? '',
      };
    })
  );

  return items.map((item, index) => {
    if (index >= MAX_GENRE_ENRICHMENT) {
      return item;
    }
    const result = results[index];

    if (result?.status !== 'fulfilled') {
      return item;
    }

    return {
      ...item,
      year: result.value.year || item.year,
      genre: result.value.genre,
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

      return enrichDetails(items);
    } catch {
      return [];
    }
  }
}
