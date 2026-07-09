import type { FunctionComponent } from 'react';
import { Link } from '@tanstack/react-router';
import { BarChart3, House, Library, Plus, type LucideIcon } from 'lucide-react';
import { Typography } from '#/components/ui/typography';
import { cn } from '#/lib/utils';

/**
 * Types
 */

export type TabId = 'home' | 'collection' | 'add' | 'analytics';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
  to: string;
}

interface BottomNavProps {
  activeTab: TabId;
}

/**
 * Constants
 */

const TABS: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    icon: House,
    to: '/inicio',
  },
  {
    id: 'collection',
    label: 'Collection',
    icon: Library,
    to: '/collection',
  },
  {
    id: 'add',
    label: 'Add',
    icon: Plus,
    to: '/release/add',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    to: '/analytics',
  },
];

/**
 * BottomNav
 */

export const BottomNav: FunctionComponent<BottomNavProps> = ({ activeTab }) => (
  <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-sm">
    <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
      {TABS.map(({ id, label, icon: Icon, to }) => (
        <Link
          key={id}
          to={to}
          className={cn(
            'flex flex-col items-center gap-0.5 no-underline transition-colors',
            activeTab === id ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <Icon className="size-5" />
          <Typography size="2xs" weight="medium">
            {label}
          </Typography>
        </Link>
      ))}
    </div>
  </nav>
);
