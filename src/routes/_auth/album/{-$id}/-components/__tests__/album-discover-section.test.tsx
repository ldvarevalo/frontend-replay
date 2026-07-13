import { fireEvent } from '@testing-library/react';
import { render, screen, waitFor } from '@test-utils';
import * as useLogListeningSessionModule from '#/routes/_auth/album/{-$id}/session/-hooks/use-log-listening-session';
import { AlbumDiscoverSection } from '../album-discover-section';

/**
 * Mocks
 */

const mockMutate = vi.fn();

/**
 * Tests
 */

describe('AlbumDiscoverSection', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    vi.spyOn(useLogListeningSessionModule, 'useLogListeningSession').mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    albumId: 'TEST.ALBUM.ID',
    addedAt: '2026-06-15T10:00:00Z',
    archivedAt: null,
    lastSessionScope: null,
    lastSessionListenedAt: null,
    onAddToWishlist: vi.fn(),
    onArchive: vi.fn(),
    onUnarchive: vi.fn(),
  };

  it('should render DISCOVER label and formatted date when addedAt is provided', () => {
    render(<AlbumDiscoverSection {...defaultProps} />);

    expect(screen.getByText('DISCOVER')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Jun 15, 2026')).toBeInTheDocument();
  });

  it('should hide date section when addedAt is null', () => {
    render(
      <AlbumDiscoverSection {...defaultProps} addedAt={null} />
    );

    expect(screen.queryByText('DISCOVER')).not.toBeInTheDocument();
  });

  it('should render archived notice when archivedAt is set', () => {
    render(
      <AlbumDiscoverSection
        {...defaultProps}
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
      />
    );

    expect(
      screen.getByText('You marked this album as Not for Me.')
    ).toBeInTheDocument();
    expect(screen.getByText('BRING BACK')).toBeInTheDocument();
  });

  it('should hide decision actions when archived', () => {
    render(
      <AlbumDiscoverSection
        {...defaultProps}
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
      />
    );

    expect(screen.queryByText('Ready to decide?')).not.toBeInTheDocument();
    expect(screen.queryByText('ADD TO WISHLIST')).not.toBeInTheDocument();
    expect(screen.queryByText('NOT FOR ME')).not.toBeInTheDocument();
  });

  it('should call onUnarchive when BRING BACK is clicked', () => {
    const handleUnarchiveMock = vi.fn();

    render(
      <AlbumDiscoverSection
        {...defaultProps}
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
        onUnarchive={handleUnarchiveMock}
      />
    );

    screen.getByText('BRING BACK').click();

    expect(handleUnarchiveMock).toHaveBeenCalledTimes(1);
  });

  it('should render listening section with prompt when no sessions', () => {
    render(<AlbumDiscoverSection {...defaultProps} />);

    expect(
      screen.getByText('Have you listened to this album?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('LOG LISTENING SESSION')
    ).toBeInTheDocument();
  });

  it('should open compact dialog and show scope toggle buttons', async () => {
    render(<AlbumDiscoverSection {...defaultProps} />);

    fireEvent.click(screen.getByText('LOG LISTENING SESSION'));

    await waitFor(() => {
      expect(
        screen.getByText('FULL ALBUM')
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('PART OF THE ALBUM')
    ).toBeInTheDocument();
    expect(screen.getByText('SAVE')).toBeInTheDocument();
  });

  it('should call logSession with selected scope on save', async () => {
    render(<AlbumDiscoverSection {...defaultProps} />);

    fireEvent.click(screen.getByText('LOG LISTENING SESSION'));

    await waitFor(() => {
      expect(screen.getByText('SAVE')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /part of the album/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      { scope: 'partial_release' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
  });
});
