import type { MusicSearchRepository, SearchItem } from './types';
import { apiClient } from '../../core/clients/react-query/api';

const SEARCH_ENDPOINT = '/api/music/search';

/**
 * DeezerMusicSearchRepository
 */

export class DeezerMusicSearchRepository implements MusicSearchRepository {
  async search(query: string): Promise<SearchItem[]> {
    try {
      const res = await apiClient.get<{ data: SearchItem[] }>(
        `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`
      );

      return res.data.data;
    } catch {
      return [];
    }
  }
}
