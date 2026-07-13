import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { RecentlyListenedCard } from '../recently-listened-card';

const MOCK_PROPS = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
  listenedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
} as const;

describe('RecentlyListenedCard', () => {
  it('should render album title and artist', () => {
    render(
      <RecentlyListenedCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        listenedAt={MOCK_PROPS.listenedAt}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('AN.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
  });

  it('should render relative time since last listened', () => {
    render(
      <RecentlyListenedCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        listenedAt={MOCK_PROPS.listenedAt}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('5 hours ago')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    const handleClickMock = vi.fn();

    render(
      <RecentlyListenedCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        listenedAt={MOCK_PROPS.listenedAt}
        onClick={handleClickMock}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
