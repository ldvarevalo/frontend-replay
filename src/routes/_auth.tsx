import type { FunctionComponent } from 'react';
import {
  createFileRoute,
  redirect,
  Outlet,
  useMatchRoute,
  useLocation,
} from '@tanstack/react-router';
import { type TabId, BottomNav } from '#/components/bottom-nav';
import { Header } from '#/components/header';
import { authStore } from '#/core/auth/store';
import type { FileRouteTypes } from '#/routeTree.gen';

/**
 * Constants
 */

const TAB_ROUTES: [TabId, FileRouteTypes['to']][] = [
  ['home', '/inicio'],
  ['collection', '/collection'],
  ['add', '/release/add'],
  ['analytics', '/analytics'],
];

/**
 * Components
 */

const AuthenticatedLayout: FunctionComponent = () => {
  const matchRoute = useMatchRoute();
  const location = useLocation();
  const activeTab: TabId = location.pathname.startsWith('/album/')
    ? 'collection'
    : (TAB_ROUTES.find(([, to]) => matchRoute({ to }))?.[0] ?? 'home');

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <Outlet />
      <BottomNav activeTab={activeTab} />
    </div>
  );
};

/**
 * AuthenticatedRoute
 */

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ location }) => {
    if (!authStore.getUser()) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});
