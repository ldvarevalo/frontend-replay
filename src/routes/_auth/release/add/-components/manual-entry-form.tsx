import type { FunctionComponent } from 'react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { SearchableSelect } from '#/components/ui/searchable-select';
import { Typography } from '#/components/ui/typography';
import type { LookupResult } from '#/repositories/types';
import type { ManualEntryData } from '#/types/domain';
import { ArtworkPreview } from './artwork-preview';

/** Types */

interface FieldConfig {
  key: keyof ManualEntryData;
  label: string;
  placeholder: string;
  width: 'full' | 'half';
}

export interface SearchLookupState {
  results: LookupResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
}

export interface ManualEntryFormProps {
  values: ManualEntryData;
  onFieldChange: (field: keyof ManualEntryData, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  isPending?: boolean;
  artistSearch: SearchLookupState;
  genreSearch: SearchLookupState;
}

/** Constants */

const FULL_FIELDS: FieldConfig[] = [
  {
    key: 'title',
    label: 'RELEASE TITLE',
    placeholder: 'e.g. A Love Supreme',
    width: 'full',
  },
  {
    key: 'artist',
    label: 'ARTIST',
    placeholder: 'e.g. John Coltrane',
    width: 'full',
  },
];

const HALF_FIELDS: FieldConfig[] = [
  {
    key: 'year',
    label: 'RELEASE YEAR',
    placeholder: '1965',
    width: 'half',
  },
  {
    key: 'genre',
    label: 'GENRE',
    placeholder: 'Jazz',
    width: 'half',
  },
];

const SEARCHABLE_FIELDS: ReadonlySet<keyof ManualEntryData> = new Set([
  'artist',
  'genre',
]);

/** Helpers */

const searchLookupFor = (
  key: keyof ManualEntryData,
  artistSearch: SearchLookupState,
  genreSearch: SearchLookupState
): SearchLookupState | undefined => {
  if (key === 'artist') {
    return artistSearch;
  }
  if (key === 'genre') {
    return genreSearch;
  }

  return undefined;
};

/** ManualEntryForm */

export const ManualEntryForm: FunctionComponent<ManualEntryFormProps> = ({
  values,
  onFieldChange,
  onSubmit,
  isValid,
  isPending = false,
  artistSearch,
  genreSearch,
}) => (
  <div className="space-y-4">
    {FULL_FIELDS.map(({ key, label, placeholder }) => {
      const search = searchLookupFor(key, artistSearch, genreSearch);

      return (
        <div key={key}>
          <Typography
            size="xs"
            weight="black"
            tracking="widest"
            transform="uppercase"
            className="mb-2 text-primary"
          >
            {label}
          </Typography>
          {search && SEARCHABLE_FIELDS.has(key) ? (
            <SearchableSelect
              value={values[key]}
              placeholder={placeholder}
              results={search.results}
              isSearching={search.isSearching}
              onSearch={search.onSearch}
              onChange={v => onFieldChange(key, v)}
            />
          ) : (
            <Input
              value={values[key]}
              onChange={e => onFieldChange(key, e.target.value)}
              placeholder={placeholder}
            />
          )}
        </div>
      );
    })}

    <div className="flex gap-4">
      {HALF_FIELDS.map(({ key, label, placeholder }) => {
        const search = searchLookupFor(key, artistSearch, genreSearch);

        return (
          <div key={key} className="flex-1">
            <Typography
              size="xs"
              weight="black"
              tracking="widest"
              transform="uppercase"
              className="mb-2 text-primary"
            >
              {label}
            </Typography>
            {search && SEARCHABLE_FIELDS.has(key) ? (
              <SearchableSelect
                value={values[key]}
                placeholder={placeholder}
                results={search.results}
                isSearching={search.isSearching}
                onSearch={search.onSearch}
                onChange={v => onFieldChange(key, v)}
              />
            ) : (
              <Input
                value={values[key]}
                onChange={e => onFieldChange(key, e.target.value)}
                placeholder={placeholder}
              />
            )}
          </div>
        );
      })}
    </div>

    <div>
      <Typography
        size="xs"
        weight="black"
        tracking="widest"
        transform="uppercase"
        className="mb-2 text-primary"
      >
        STATUS
      </Typography>
      <div className="flex gap-4">
        <div className="flex-1">
          <Button
            variant={values.status === 'want' ? 'primary' : 'outline'}
            size="lg"
            onClick={() => onFieldChange('status', 'want')}
          >
            WANT
          </Button>
        </div>
        <div className="flex-1">
          <Button
            variant={values.status === 'owned' ? 'primary' : 'outline'}
            size="lg"
            onClick={() => onFieldChange('status', 'owned')}
          >
            OWNED
          </Button>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <Typography
        size="xs"
        weight="black"
        tracking="widest"
        transform="uppercase"
        className="mb-2 text-primary"
      >
        ARTWORK URL
      </Typography>
      <div className="flex flex-1 flex-col gap-4">
        <Input
          value={values.artworkUrl}
          onChange={e => onFieldChange('artworkUrl', e.target.value)}
          placeholder="https://..."
        />
        <div className="w-full shrink-0">
          <ArtworkPreview imageUrl={values.artworkUrl} />
        </div>
      </div>
    </div>

    <Button
      variant="primary"
      size="lg"
      onClick={onSubmit}
      disabled={!isValid || isPending}
    >
      {isPending ? 'SAVING…' : 'SAVE'}
    </Button>
  </div>
);
