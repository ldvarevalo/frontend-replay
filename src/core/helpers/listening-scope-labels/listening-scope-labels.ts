import type { ListeningScope } from '#/types/domain';

/**
 * Types
 */

export interface SideOption {
  value: string;
  label: string;
}

/**
 * Constants
 */

export const LISTENING_SCOPE_LABELS: Record<ListeningScope, string> = {
  full_release: 'Full Album',
  partial_release: 'Part of the Album',
  side_a: 'Side A',
  side_b: 'Side B',
  side_c: 'Side C',
  side_d: 'Side D',
};

export const TRACK_SIDE_OPTIONS: SideOption[] = (
  ['side_a', 'side_b', 'side_c', 'side_d'] as const
).map(side => ({
  value: side,
  label: LISTENING_SCOPE_LABELS[side],
}));

/**
 * getListeningScopeLabel
 */

export const getListeningScopeLabel = (scope: string): string =>
  LISTENING_SCOPE_LABELS[scope as ListeningScope] ?? scope;
