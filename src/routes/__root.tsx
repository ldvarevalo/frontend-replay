import type { ReactNode } from 'react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import appCss from '../styles.css?url';

/**
 * Constants
 */

const showDevtools = import.meta.env.VITE_TANSTACK_DEVTOOLS_ENABLED === 'true';

/**
 * Root
 */

const RootDocument = (): ReactNode => (
  <>
    <HeadContent />
    <Outlet />
    {showDevtools && (
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'Tanstack Query',
            render: <ReactQueryDevtools initialIsOpen={false} />,
          },
        ]}
      />
    )}
  </>
);

/**
 * Root route
 */

export const Route = createRootRouteWithContext<{
  queryClient: import('@tanstack/react-query').QueryClient;
}>()({
  component: RootDocument,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
});
