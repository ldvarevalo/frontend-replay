import type { ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';

/**
 * Types
 */

export interface PageHeaderHook {
  title: string;
  onBack?: () => void;
  actions?: ReactNode;
}

/**
 * usePageHeader
 */

export const usePageHeader = <
  T extends { pageHeader?: PageHeaderHook },
>(): PageHeaderHook => {
  const matches = useRouterState().matches;
  const loaderData = matches[matches.length - 1]?.loaderData as T | undefined;

  return loaderData?.pageHeader ?? { title: 'Replay' };
};
