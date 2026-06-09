import { useState, type FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SearchBar } from '#/components/search-bar';
import { Typography } from '#/components/ui/typography';
import { useRepositories } from '#/repositories/hooks';
import type { ManualEntryData } from '#/types/domain';
import { ManualEntryForm } from './-components/manual-entry-form';
import { Pagination } from './-components/pagination';
import { SearchResults } from './-components/search-results';
import { SectionDivider } from './-components/section-divider';
import { useCreateManualRelease } from './-hooks/use-create-manual-release';
import { useSearchLookup } from './-hooks/use-search-lookup';
import { useSearchReleases } from './-hooks/use-search-releases';

/**
 * Constants
 */

const INITIAL_VALUES: ManualEntryData = {
  title: '',
  artist: '',
  year: '',
  genre: '',
  artworkUrl: '',
};

/**
 * AddReleasePage
 */

const AddReleasePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    results,
    currentPage,
    totalPages,
    setCurrentPage,
    toggleResult,
  } = useSearchReleases();
  const { artists, genres } = useRepositories();
  const artistSearch = useSearchLookup({ searchFn: q => artists.search(q) });
  const genreSearch = useSearchLookup({ searchFn: q => genres.search(q) });
  const [values, setValues] = useState<ManualEntryData>(INITIAL_VALUES);
  const { mutateAsync, isPending } = useCreateManualRelease();

  const setField = (field: keyof ManualEntryData, value: string): void => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid = values.title.trim() !== '' && values.artist.trim() !== '';

  const handleSubmit = async (): Promise<void> => {
    // TODO: show toast on error
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
        <SearchBar
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="SEARCH ARTIST OR ALBUM"
        />
      </div>

      {results.length > 0 && (
        <>
          <SearchResults results={results} onToggle={toggleResult} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <SectionDivider label="OR MANUAL ENTRY" />

      <ManualEntryForm
        values={values}
        onFieldChange={setField}
        onSubmit={handleSubmit}
        isValid={isValid}
        isPending={isPending}
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
