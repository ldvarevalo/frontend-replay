import { createFileRoute, redirect } from '@tanstack/react-router';

/**
 * LogoutRoute
 */

export const Route = createFileRoute('/logout/')({
  loader: () => {
    localStorage.removeItem('is_authenticated');
    throw redirect({
      to: '/',
      replace: true,
    });
  },
});