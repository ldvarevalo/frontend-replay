import type { FunctionComponent } from 'react';
import { Link } from '@tanstack/react-router';

/**
 * Header component
 */

export const Header: FunctionComponent = () => (
  <header className="sticky flex items-center justify-between top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
    <nav className="page-wrap flex flex-wrap gap-x-3 gap-y-2 py-3 sm:py-4">
      <h2 className="display-title font-bold italic text-2xl m-0 flex-shrink-0 tracking-tight">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[var(--sea-ink)] no-underline sm:px-4 sm:py-2"
        >
          Crate
        </Link>
      </h2>

      <div className="order-3 flex w-full items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
        <Link
          to="/"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          Dashboard
        </Link>
        <Link
          to="/collection"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          Collection
        </Link>
        <Link
          to="/add"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          Add
        </Link>
      </div>
    </nav>
  </header>
);
