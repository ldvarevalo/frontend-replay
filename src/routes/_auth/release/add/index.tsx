import { useMemo, useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SearchableSelect } from '#/components/ui/searchable-select';
import { Typography } from '#/components/ui/typography';
import { useRepositories } from '#/repositories/hooks';
import type { LookupResult, SearchItem } from '#/repositories/types';
import type { ManualEntryData } from '#/types/domain';
import { ManualEntryForm } from './-components/manual-entry-form';
import { SectionDivider } from './-components/section-divider';
import { useAlbumSearch } from './-hooks/use-album-search';
import { useCreateManualRelease } from './-hooks/use-create-manual-release';
import { useSearchLookup } from './-hooks/use-search-lookup';

/**
 * Constants
 */

const INITIAL_VALUES: ManualEntryData = {
  title: '',
  artist: '',
  year: '',
  genre: '',
  artworkUrl: '',
  status: 'want',
};

/**
 * Helpers
 */

const toLookupResult = (item: SearchItem): LookupResult => ({
  id: item.id,
  name: item.title,
  thumbnail: item.coverUrl,
  subtitle: item.artist,
});

/**
 * AddReleasePage
 */

// eslint-disable-next-line max-statements
export const AddReleasePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { query, setQuery, results, isPending } = useAlbumSearch();
  const { artists, genres } = useRepositories();
  const artistSearch = useSearchLookup({ searchFn: q => artists.search(q) });
  const genreSearch = useSearchLookup({ searchFn: q => genres.search(q) });
  const [values, setValues] = useState<ManualEntryData>(INITIAL_VALUES);
  const { mutateAsync, isPending: isSaving } = useCreateManualRelease();

  const lookupResults = useMemo<LookupResult[]>(
    () => results.map(toLookupResult),
    [results]
  );

  const emptyMessage = query.length >= 2 ? 'No matches' : undefined;

  const setField = (field: keyof ManualEntryData, value: string): void => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectSearchItem = (item: LookupResult): void => {
    const source = results.find(r => r.id === item.id);
    if (!source) {
      return;
    }
    setValues({
      title: source.title,
      artist: source.artist,
      year: source.year,
      genre: source.genre,
      artworkUrl: source.coverUrl,
      status: 'want',
    });
  };

  const isValid = values.title.trim() !== '' && values.artist.trim() !== '';

  const handleSubmit = async (): Promise<void> => {
    await mutateAsync(values);

    setValues(INITIAL_VALUES);
    navigate({ to: '/collection' });
  };

  return (
    <main className="page-wrap space-y-6 py-6">
      <Typography as="h2" family="heading" size="2xl">
        Add release
      </Typography>

      <div>
        <Typography
          size="xs"
          weight="bold"
          tracking="widest"
          transform="uppercase"
          className="mb-6 text-primary"
        >
          SEARCH RESULTS
        </Typography>
        <SearchableSelect
          value=""
          placeholder="SEARCH ALBUM"
          results={lookupResults}
          isSearching={isPending}
          onSearch={setQuery}
          onChange={() => {}}
          onSelect={handleSelectSearchItem}
          emptyMessage={emptyMessage}
        />
      </div>

      <SectionDivider label="OR MANUAL ENTRY" />

      <ManualEntryForm
        values={values}
        onFieldChange={setField}
        onSubmit={handleSubmit}
        isValid={isValid}
        isPending={isSaving}
        artistSearch={artistSearch}
        genreSearch={genreSearch}
      />
    </main>
  );
};

/**
 * AddReleaseRoute
 */

export const Route = createFileRoute('/_auth/release/add/')({
  component: AddReleasePage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
    },
  }),
});
