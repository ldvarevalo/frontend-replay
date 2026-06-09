import type { FunctionComponent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SearchBar } from '#/components/search-bar';
import { Typography } from '#/components/ui/typography';
import { CollectionAlbumGrid } from './-components/collection-album-grid';
import { FilterTabs } from './-components/filter-tabs';
import { useCollectionData } from './-hooks/use-collection-data';

/**
 * Constants
 */

const TABS = [
  {
    id: 'ALL',
    label: 'ALL',
  },
  {
    id: 'OWNED',
    label: 'OWNED',
  },
  {
    id: 'WANT',
    label: 'WANT',
  },
  {
    id: 'LISTENED',
    label: 'LISTENED',
  },
];

/**
 * CollectionPage
 */

const CollectionPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    filteredAlbums,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  } = useCollectionData();

  return (
    <main className="page-wrap space-y-6 py-6">
      <SearchBar
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="mb-8">
        <Typography as="h2" family="heading" size="2xl">
          Archive
        </Typography>
        <Typography
          size="xs"
          weight="medium"
          transform="uppercase"
          tracking="wider"
        >
          {filteredAlbums.length} RECORDS COLLECTED
        </Typography>
      </div>
      <FilterTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <CollectionAlbumGrid
        albums={filteredAlbums}
        onAlbumClick={id => navigate({ to: `/album/${id}` })}
      />
    </main>
  );
};

/**
 * CollectionRoute
 */

export const Route = createFileRoute('/_auth/collection/')({
  component: CollectionPage,
  loader: () => ({
    pageHeader: {
      title: 'Crate',
    },
  }),
});
