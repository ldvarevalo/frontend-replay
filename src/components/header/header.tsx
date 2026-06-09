import type { FunctionComponent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { usePageHeader } from '#/core/hooks/use-page-header';

/**
 * Header
 */

export const Header: FunctionComponent = () => {
  const navigate = useNavigate();
  const { title, showBack, actions } = usePageHeader();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {showBack && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: '..' })}
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        {showBack ? (
          <span className="font-heading text-2xl font-bold italic tracking-tight text-foreground">
            {title}
          </span>
        ) : (
          <h2 className="font-heading text-2xl font-bold italic tracking-tight">
            <Link to="/inicio" className="text-foreground no-underline">
              {title}
            </Link>
          </h2>
        )}
      </div>

      {actions ?? (
        <Link
          to="/logout"
          aria-label="Log out"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-5" />
        </Link>
      )}
    </header>
  );
};
