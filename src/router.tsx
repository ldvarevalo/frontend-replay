import {
  createRouter as createTanStackRouter,
  type AnyRouter,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

export const getRouter = (queryClient: QueryClient): AnyRouter => {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    context: { queryClient },
  });

  return router;
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
