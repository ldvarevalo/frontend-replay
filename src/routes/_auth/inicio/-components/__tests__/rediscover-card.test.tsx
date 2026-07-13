import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { RediscoverCard } from '../rediscover-card';

/**
 * Mocks
 */

const MOCK_PROPS = {
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.OLD.ALBUM',
  artist: 'AN.OLD.ARTIST',
} as const;

/**
 * Tests
 */

describe('RediscoverCard', () => {
  it('should render album title and artist', () => {
    render(
      <RediscoverCard
        coverUrl={MOCK_PROPS.coverUrl}
        title={MOCK_PROPS.title}
        artist={MOCK_PROPS.artist}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('AN.OLD.ALBUM')).toBeInTheDocument();
    expect(screen.getByText('AN.OLD.ARTIST')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    const handleClickMock = vi.fn();

    render(
      <RediscoverCard
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
