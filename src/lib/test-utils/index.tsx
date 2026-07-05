/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterContextProvider, createRouter } from '@tanstack/react-router';
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import type { RenderOptions, RenderHookOptions } from '@testing-library/react';
import { createTestAuthAdapter } from '#/core/auth/adapters/__tests__/test-adapter';
import { AuthProvider } from '#/core/auth/auth-context';
import type { AuthUser } from '#/core/auth/types';
import { createTestQueryClient } from '#/core/clients/react-query/query-client';
import { routeTree } from '#/routeTree.gen';

/**
 * Constants
 */

const testQueryClient = createTestQueryClient();
const testAdapter = createTestAuthAdapter();

/**
 * routerMock
 */

export const routerMock = createRouter({
  routeTree,
  context: { queryClient: testQueryClient },
});

/**
 * Components
 */

const AllTheProviders = ({ children }: { children: ReactNode }) => (
  <AuthProvider adapter={testAdapter}>
    <QueryClientProvider client={testQueryClient}>
      <RouterContextProvider router={routerMock}>
        {children}
      </RouterContextProvider>
    </QueryClientProvider>
  </AuthProvider>
);

/**
 * render
 */

const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

/**
 * renderHook
 */

const renderHook = <T,>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) =>
  rtlRenderHook(callback, {
    wrapper: AllTheProviders,
    ...options,
  });

/**
 * renderWithAuth
 */

const renderWithAuth = (
  ui: ReactElement,
  authUser: AuthUser | null,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const adapter = createTestAuthAdapter(authUser);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider adapter={adapter}>
      <QueryClientProvider client={testQueryClient}>
        <RouterContextProvider router={routerMock}>
          {children}
        </RouterContextProvider>
      </QueryClientProvider>
    </AuthProvider>
  );

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

/**
 * mockFn
 */

const mockFn = vi.fn();

export { render, renderHook, renderWithAuth, mockFn, screen, waitFor };
export type { ReactNode };
