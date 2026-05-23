import type { FunctionComponent } from 'react';
import { Link } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

export const Header: FunctionComponent = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-4 backdrop-blur-sm">
    <h2 className="font-heading text-2xl font-bold italic tracking-tight">
      <Link to="/inicio" className="text-foreground no-underline">
        Crate
      </Link>
    </h2>

    <Link
      to="/logout"
      aria-label="Log out"
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      <LogOut className="size-5" />
    </Link>
  </header>
);
