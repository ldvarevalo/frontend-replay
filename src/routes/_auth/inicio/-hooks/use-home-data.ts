import type {
  Album,
  HomeData,
  HomeStats,
  Track,
} from '#/types/domain';

/**
 * Constants
 */

const MOCK_ALBUMS: Album[] = [
  {
    id: '1',
    coverUrl: 'https://picsum.photos/seed/album1/400',
    title: 'Dark Side',
    artist: 'Pink Floyd',
  },
  {
    id: '2',
    coverUrl: 'https://picsum.photos/seed/album2/400',
    title: 'Rumours',
    artist: 'Fleetwood Mac',
  },
  {
    id: '3',
    coverUrl: 'https://picsum.photos/seed/album3/400',
    title: 'Thriller',
    artist: 'Michael Jackson',
  },
  {
    id: '4',
    coverUrl: 'https://picsum.photos/seed/album4/400',
    title: 'Back in Black',
    artist: 'AC/DC',
  },
];

const MOCK_TRACKS: Track[] = [
  {
    id: 't1',
    thumbnail: 'https://picsum.photos/seed/track1/200',
    title: 'Time',
    artist: 'Pink Floyd',
    duration: '6:53',
  },
  {
    id: 't2',
    thumbnail: 'https://picsum.photos/seed/track2/200',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    duration: '4:17',
  },
  {
    id: 't3',
    thumbnail: 'https://picsum.photos/seed/track3/200',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    duration: '4:54',
    isActive: true,
  },
  {
    id: 't4',
    thumbnail: 'https://picsum.photos/seed/track4/200',
    title: 'Hells Bells',
    artist: 'AC/DC',
    duration: '5:12',
  },
  {
    id: 't5',
    thumbnail: 'https://picsum.photos/seed/track5/200',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    duration: '5:55',
  },
];

const MOCK_STATS: HomeStats = {
  totalReleases: 1428,
  thisMonth: 42,
  wantToListen: 12,
};

/**
 * UseHomeData
 */

export const useHomeData = (): HomeData => ({
  stats: MOCK_STATS,
  albums: MOCK_ALBUMS,
  tracks: MOCK_TRACKS,
});
