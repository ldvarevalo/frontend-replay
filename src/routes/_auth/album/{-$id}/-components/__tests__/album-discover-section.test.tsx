import { fireEvent } from '@testing-library/react';
import { render, screen, waitFor } from '@test-utils';
import { AlbumDiscoverSection } from '../album-discover-section';

/**
 * Tests
 */

describe('AlbumDiscoverSection', () => {
  it('should render DISCOVER label and formatted date when addedAt is provided', () => {
    render(
      <AlbumDiscoverSection
        addedAt="2026-06-15T10:00:00Z"
        archivedAt={null}
        onAddToWishlist={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />
    );

    expect(screen.getByText('DISCOVER')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Jun 15, 2026')).toBeInTheDocument();
  });

  it('should hide date section when addedAt is null', () => {
    render(
      <AlbumDiscoverSection
        addedAt={null}
        archivedAt={null}
        onAddToWishlist={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />
    );

    expect(screen.queryByText('DISCOVER')).not.toBeInTheDocument();
  });

  it('should render archived notice when archivedAt is set', () => {
    render(
      <AlbumDiscoverSection
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
        onAddToWishlist={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
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
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
        onAddToWishlist={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
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
        addedAt={null}
        archivedAt="2026-07-01T10:00:00Z"
        onAddToWishlist={vi.fn()}
        onArchive={vi.fn()}
        onUnarchive={handleUnarchiveMock}
      />
    );

    screen.getByText('BRING BACK').click();

    expect(handleUnarchiveMock).toHaveBeenCalledTimes(1);
  });

  it('should open dialog and call onAddToWishlist on confirm', async () => {
    const handleAddToWishlistMock = vi.fn();

    render(
      <AlbumDiscoverSection
        addedAt={null}
        archivedAt={null}
        onAddToWishlist={handleAddToWishlistMock}
        onArchive={vi.fn()}
        onUnarchive={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('ADD TO WISHLIST'));

    await waitFor(() => {
      expect(screen.getByText('Add to Wishlist?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add to Wishlist'));

    expect(handleAddToWishlistMock).toHaveBeenCalledTimes(1);
  });

  it('should open dialog and call onArchive on confirm', async () => {
    const handleArchiveMock = vi.fn();

    render(
      <AlbumDiscoverSection
        addedAt={null}
        archivedAt={null}
        onAddToWishlist={vi.fn()}
        onArchive={handleArchiveMock}
        onUnarchive={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('NOT FOR ME'));

    await waitFor(() => {
      expect(screen.getByText('Not for Me?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Not for Me'));

    expect(handleArchiveMock).toHaveBeenCalledTimes(1);
  });
});
