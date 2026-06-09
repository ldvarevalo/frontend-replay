import type { ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';

/**
 * Types
 */

export interface PageHeaderOptions {
  title: string;
  showBack?: boolean;
  actions?: ReactNode;
}

/**
 * usePageHeader
 */

export const usePageHeader = <
  T extends { pageHeader?: PageHeaderOptions },
>(): PageHeaderOptions => {
  const matches = useRouterState().matches;
  const loaderData = matches[matches.length - 1]?.loaderData as T | undefined;

  return loaderData?.pageHeader ?? { title: '' };
};
