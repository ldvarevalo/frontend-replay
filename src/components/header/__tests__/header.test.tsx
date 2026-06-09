import { render, screen } from '@test-utils';
import { usePageHeader } from '#/core/hooks/use-page-header';
import { Header } from '../header';

vi.mock('#/core/hooks/use-page-header');

/**
 * Header
 */

describe('Header', () => {
  beforeEach(() => {
    vi.mocked(usePageHeader).mockReturnValue({
      title: 'Crate',
    });
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

  it('should render back button when showBack is true', () => {
    vi.mocked(usePageHeader).mockReturnValue({
      title: 'Album',
      showBack: true,
    });

    render(<Header />);

    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log out' })).toBeInTheDocument();
  });
});
