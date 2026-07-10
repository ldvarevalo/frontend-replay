import { fireEvent } from '@testing-library/react';
import { render, screen } from '@test-utils';
import { DailyPickCard } from '../daily-pick-card';

const MOCK_ALBUM = {
  id: 'A.DAILY.PICK.ID',
  coverUrl: 'https://example.com/cover.jpg',
  title: 'AN.ALBUM.TITLE',
  artist: 'AN.ARTIST.NAME',
  createdAt: '2024-01-15T00:00:00Z',
} as const;

describe('DailyPickCard', () => {
  it('should render album info and relative date', () => {
    render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={vi.fn()}
        onShowAnother={vi.fn()}
      />
    );

    expect(screen.getByText("Today's Pick")).toBeInTheDocument();
    expect(screen.getByText('AN.ALBUM.TITLE')).toBeInTheDocument();
    expect(screen.getByText('AN.ARTIST.NAME')).toBeInTheDocument();
    expect(screen.getByText(/Added.*ago/)).toBeInTheDocument();
    expect(screen.getByText('Listen today →')).toBeInTheDocument();
    expect(screen.getByText('Show another')).toBeInTheDocument();
  });

  it('should fire onListenToday when clicking listen CTA', () => {
    const handleListenTodayMock = vi.fn();

    render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={handleListenTodayMock}
        onShowAnother={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Listen today →'));
    expect(handleListenTodayMock).toHaveBeenCalledTimes(1);
  });

  it('should fire onShowAnother when clicking show another', () => {
    const handleShowAnotherMock = vi.fn();

    render(
      <DailyPickCard
        album={MOCK_ALBUM}
        onListenToday={vi.fn()}
        onShowAnother={handleShowAnotherMock}
      />
    );

    fireEvent.click(screen.getByText('Show another'));
    expect(handleShowAnotherMock).toHaveBeenCalledTimes(1);
  });
});
