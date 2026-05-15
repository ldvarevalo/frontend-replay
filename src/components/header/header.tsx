import type { FunctionComponent } from 'react';
import { Link } from '@tanstack/react-router';

export const Header: FunctionComponent = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
    <nav className="page-wrap flex flex-wrap gap-x-3 gap-y-2 py-3 sm:py-4">
      <h2 className="m-0 flex-shrink-0 font-heading text-2xl font-bold italic tracking-tight">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground no-underline sm:px-4 sm:py-2"
        >
          Crate
        </Link>
      </h2>

      <div className="order-3 flex w-full items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
        <Link
          to="/inicio"
          className="text-muted-foreground no-underline transition-colors hover:text-foreground"
          activeProps={{ className: 'text-foreground' }}
        >
          Dashboard
        </Link>
        <Link
          to="/collection"
          className="text-muted-foreground no-underline transition-colors hover:text-foreground"
          activeProps={{ className: 'text-foreground' }}
        >
          Collection
        </Link>
        <Link
          to="/add"
          className="text-muted-foreground no-underline transition-colors hover:text-foreground"
          activeProps={{ className: 'text-foreground' }}
        >
          Add
        </Link>
        <Link
          to="/logout"
          className="text-muted-foreground no-underline transition-colors hover:text-foreground"
        >
          Logout
        </Link>
      </div>
    </nav>
  </header>
);
