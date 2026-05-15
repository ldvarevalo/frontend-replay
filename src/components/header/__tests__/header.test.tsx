import { createRouter } from '@tanstack/react-router';
import { render, screen } from '@test-utils';
import { routeTree } from '#/routeTree.gen';
import { Header } from '../header';

const router = createRouter({ routeTree });

/**
 * Header
 */

describe('Header', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should render logo link', () => {
    render(<Header />);

    expect(screen.getByText('Crate')).toBeInTheDocument();
    expect(document.body).toMatchSnapshot();
  });

  it('should render navigation links when authenticated on auth route', async () => {
    localStorage.setItem('is_authenticated', 'true');

    await router.navigate({ to: '/inicio' });

    render(<Header />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Collection' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Add' })).toBeInTheDocument();
  });
});
