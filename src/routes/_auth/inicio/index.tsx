import type { FunctionComponent } from 'react';
import { createFileRoute } from '@tanstack/react-router';

/**
 * Types
 */

interface HomeProps {}

/**
 * Home
 */

export const Home: FunctionComponent<HomeProps> = () => (
    <main className="page-wrap">
      <h1>Home</h1>
    </main>
  );

/**
 * HomeRoute
 */

export const Route = createFileRoute('/_auth/inicio/')({
  component: Home,
});