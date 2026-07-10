import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { RecentlyListenedCard } from '../recently-listened-card';

const MOCK_PROPS = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
} as const;

describe('RecentlyListenedCard', () => {
  it('should render album title and artist', () => {
    render(
      <RecentlyListenedCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('AN.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    const handleClickMock = vi.fn();

    render(
      <RecentlyListenedCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        onClick={handleClickMock}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
