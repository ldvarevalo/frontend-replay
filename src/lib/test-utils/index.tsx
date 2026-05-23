/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterContextProvider, createRouter } from '@tanstack/react-router';
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
  screen,
} from '@testing-library/react';
import type { RenderOptions, RenderHookOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { createTestQueryClient } from '#/core/clients/react-query/query-client';
import { routeTree } from '#/routeTree.gen';

/**
 * Constants
 */

const testQueryClient = createTestQueryClient();

/**
 * Router
 */

export const routerMock = createRouter({
  routeTree,
  context: { queryClient: testQueryClient },
});

/**
 * AllTheProviders
 */

const AllTheProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={testQueryClient}>
    <RouterContextProvider router={routerMock}>
      {children}
    </RouterContextProvider>
  </QueryClientProvider>
);

/**
 * Render with providers
 */

const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

const renderHook = <T,>(
  callback: () => T,
  options?: Omit<RenderHookOptions<T>, 'wrapper'>
) =>
  rtlRenderHook(callback, {
    wrapper: AllTheProviders,
    ...options,
  });

const mockFn = vi.fn();

export { render, renderHook, mockFn, screen };
export type { ReactNode };
