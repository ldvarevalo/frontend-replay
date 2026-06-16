import { render, screen } from '@test-utils';
import { TracksEmptyState } from '../tracks-empty-state';

/**
 * TracksEmptyState
 */

describe('TracksEmptyState', () => {
  it('should render empty state message', () => {
    render(<TracksEmptyState onAddClick={vi.fn()} />);

    expect(screen.getByText(/no tracklist available/i)).toBeInTheDocument();
    expect(screen.getByText(/add them manually/i)).toBeInTheDocument();
  });

  it('should call onAddClick when add button is clicked', () => {
    const handleAddMock = vi.fn();

    render(<TracksEmptyState onAddClick={handleAddMock} />);
    screen.getByRole('button', { name: /add tracks/i }).click();

    expect(handleAddMock).toHaveBeenCalledTimes(1);
  });
});
