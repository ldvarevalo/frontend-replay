import { render, screen } from '@test-utils';
import { AlbumWantSection } from '../album-want-section';

/**
 * Tests
 */

describe('AlbumWantSection', () => {
  it('should render purchase priority options', () => {
    render(
      <AlbumWantSection
        addedAt={null}
        priority={null}
        onPriorityChange={() => {}}
        onMarkAsOwned={() => {}}
      />
    );

    expect(screen.getByText('PURCHASE PRIORITY')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should render wishlist info when addedAt is provided', () => {
    render(
      <AlbumWantSection
        addedAt="2026-06-15T10:00:00Z"
        priority={null}
        onPriorityChange={() => {}}
        onMarkAsOwned={() => {}}
      />
    );

    expect(screen.getByText('WISHLIST')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Jun 15, 2026')).toBeInTheDocument();
  });

  it('should not render wishlist info when addedAt is null', () => {
    render(
      <AlbumWantSection
        addedAt={null}
        priority={null}
        onPriorityChange={() => {}}
        onMarkAsOwned={() => {}}
      />
    );

    expect(screen.queryByText('WISHLIST')).not.toBeInTheDocument();
  });

  it('should render MARK AS OWNED button', () => {
    render(
      <AlbumWantSection
        addedAt={null}
        priority={null}
        onPriorityChange={() => {}}
        onMarkAsOwned={() => {}}
      />
    );

    expect(screen.getByText('MARK AS OWNED')).toBeInTheDocument();
  });

  it('should call onPriorityChange when option clicked', () => {
    const onPriorityChange = vi.fn();

    render(
      <AlbumWantSection
        addedAt={null}
        priority={null}
        onPriorityChange={onPriorityChange}
        onMarkAsOwned={() => {}}
      />
    );

    screen.getByText('high').click();

    expect(onPriorityChange).toHaveBeenCalledWith('high');
  });
});
