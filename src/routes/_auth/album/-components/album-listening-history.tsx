import type { FunctionComponent } from 'react';
import { Play } from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Typography } from '#/components/ui/typography';
import { formatDate } from '#/core/helpers/format-date';
import type { SourceFormat } from '#/types/domain';

/**
 * Types
 */

interface SessionDisplay {
  id: string;
  listenedAt: string;
  scopeLabel: string;
  sourceFormat: SourceFormat;
}

interface AlbumListeningHistoryProps {
  sessions: SessionDisplay[];
  isLoading: boolean;
  onNewSessionClick: () => void;
}

/**
 * Helpers
 */

/**
 * LoadingState
 */

const LoadingState: FunctionComponent = () => (
  <div className="flex items-center justify-center bg-surface-container-high py-8">
    <Typography size="sm" className="text-on-surface-variant">
      Loading...
    </Typography>
  </div>
);

/**
 * EmptyState
 */

const EmptyState: FunctionComponent = () => (
  <div className="flex flex-col items-center gap-1 bg-surface-container-high py-8">
    <Typography
      family="heading"
      size="lg"
      className="text-center text-on-surface-variant"
    >
      No sessions recorded yet
    </Typography>
    <Typography size="sm" className="text-center text-on-surface-variant">
      Start your first spin of this record.
    </Typography>
  </div>
);

/**
 * SessionList
 */

const SessionList: FunctionComponent<{ sessions: SessionDisplay[] }> = ({
  sessions,
}) => (
  <ul className="divide-y divide-outline-20">
    {sessions.map(session => (
      <li
        key={session.id}
        className="flex items-center justify-between bg-surface-container-high px-4 py-3"
      >
        <div>
          <Typography size="sm" className="text-foreground">
            {formatDate(session.listenedAt)}
          </Typography>
          <Typography size="xs" className="text-on-surface-variant">
            {session.scopeLabel}
          </Typography>
        </div>
        <Typography size="xs" className="text-on-surface-variant">
          {session.sourceFormat}
        </Typography>
      </li>
    ))}
  </ul>
);

/**
 * AlbumListeningHistory
 */

export const AlbumListeningHistory: FunctionComponent<
  AlbumListeningHistoryProps
> = ({ sessions, isLoading, onNewSessionClick }) => (
  <section className="space-y-2">
    <div className="flex items-center justify-between">
      <Typography
        size="xs"
        transform="uppercase"
        className="text-on-surface-variant"
      >
        LISTENING HISTORY
      </Typography>
      <Button variant="ghost" onClick={onNewSessionClick}>
        <Play className="size-3" />
        <Typography size="xs" transform="uppercase">
          NEW SESSION
        </Typography>
      </Button>
    </div>

    {isLoading && <LoadingState />}
    {!isLoading && sessions.length === 0 && <EmptyState />}
    {!isLoading && sessions.length > 0 && <SessionList sessions={sessions} />}
  </section>
);
