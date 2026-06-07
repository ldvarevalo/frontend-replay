import type { FunctionComponent } from 'react';
import { Plus, Check } from 'lucide-react';
import { AlbumRow } from '#/components/album-row';
import type { SearchResult } from '#/types/domain';

/**
 * Types
 */

interface SearchResultsProps {
  results: SearchResult[];
  onToggle: (id: string) => void;
}

/**
 * SearchResults
 */

export const SearchResults: FunctionComponent<SearchResultsProps> = ({
  results,
  onToggle,
}) => (
  <div className="divide-y divide-outline/15">
    {results.map(result => (
      <AlbumRow
        key={result.id}
        thumbnail={result.thumbnail}
        title={result.title}
        artist={result.artist}
        isAdded={result.isAdded}
        actionIcon={
          result.isAdded ? (
            <Check className="size-4" />
          ) : (
            <Plus className="size-4" />
          )
        }
        onClick={() => onToggle(result.id)}
      />
    ))}
  </div>
);
