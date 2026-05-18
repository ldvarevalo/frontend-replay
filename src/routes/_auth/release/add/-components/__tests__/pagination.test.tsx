import { render, screen } from '@test-utils';
import { Pagination } from '../pagination';

/**
 * Mocks
 */

const handlePageChangeMock = vi.fn();

/**
 * Tests
 */

describe('Pagination', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render page numbers', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChangeMock}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should return null when totalPages <= 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={handlePageChangeMock}
      />
    );

    expect(container.innerHTML).toBe('');
  });

  it('should disable prev button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChangeMock}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={handlePageChangeMock}
      />
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons[buttons.length - 1]).toBeDisabled();
  });

  it('should fire onPageChange when page clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChangeMock}
      />
    );

    screen.getByText('3').click();

    expect(handlePageChangeMock).toHaveBeenCalledWith(3);
  });
});
