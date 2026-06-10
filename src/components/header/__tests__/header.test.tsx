import { render, screen } from '@test-utils';
import * as pageHeaderModule from '#/core/hooks/use-page-header';
import { Header } from '../header';

/**
 * Mocks
 */

const usePageHeaderMock = vi.spyOn(pageHeaderModule, 'usePageHeader');

/**
 * Header
 */

describe('Header', () => {
  beforeEach(() => {
    usePageHeaderMock.mockReturnValue({ title: 'Crate' });
  });

  it('should render logo link', () => {
    render(<Header />);

    expect(screen.getByText('Crate')).toBeInTheDocument();
    expect(document.body).toMatchSnapshot();
  });

  it('should render logout link', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: 'Log out' })).toBeInTheDocument();
  });

  it('should render back button when onBack is provided', () => {
    const handleBackMock = vi.fn();

    usePageHeaderMock.mockReturnValue({
      title: 'Album',
      onBack: handleBackMock,
    });

    render(<Header />);

    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    screen.getByLabelText('Go back').click();
    expect(handleBackMock).toHaveBeenCalledTimes(1);
  });
});
