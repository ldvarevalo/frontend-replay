import type { FunctionComponent } from "react";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { Header } from "#/components/header";

/**
 * Helpers
 */

const isAuthenticated = (): boolean =>
  localStorage?.getItem('is_authenticated') === 'true';

/**
 * AuthenticatedLayout
 */

const AuthenticatedLayout: FunctionComponent = () => (
  <div>
    <Header />
    <Outlet />
  </div>
);

/**
 * AuthenticatedRoute
 */

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});
