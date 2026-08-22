import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAnalyticsRepository } from '../analytics';

/**
 * Types
 */

interface FunnelRow {
  status: string;
  updated_at: string;
  is_listened: boolean;
}

/**
 * Helpers
 */

const queryChain = (data: unknown): Record<string, unknown> => {
  const chain: Record<string, unknown> = {};
  for (const method of [
    'select',
    'eq',
    'gte',
    'lte',
    'in',
    'is',
    'order',
    'limit',
    'maybeSingle',
  ]) {
    chain[method] = vi.fn(() => chain);
  }
  chain.then = (resolve: (value: unknown) => void) =>
    resolve({
      data,
      error: null,
    });
  return chain;
};

const buildSupabaseMock = (funnelRows: FunnelRow[]): SupabaseClient => {
  let userReleasesCalls = 0;
  const from = vi.fn((table: string) => {
    if (table === 'user_analytics') {
      return queryChain([]);
    }
    userReleasesCalls += 1;
    return userReleasesCalls === 1 ? queryChain([]) : queryChain(funnelRows);
  });
  return { from } as unknown as SupabaseClient;
};

/**
 * Tests
 */

describe('SupabaseAnalyticsRepository', () => {
  const userId = 'user-1';
  const startDate = '2026-08-01T00:00:00Z';
  const endDate = '2026-08-31T23:59:59Z';

  it('should count only owned rows whose updated_at falls in the period', async () => {
    const funnelRows: FunnelRow[] = [
      {
        status: 'owned',
        updated_at: '2026-08-15T10:00:00Z',
        is_listened: false,
      },
      {
        status: 'owned',
        updated_at: '2026-08-20T10:00:00Z',
        is_listened: false,
      },
      {
        status: 'owned',
        updated_at: '2026-08-25T10:00:00Z',
        is_listened: false,
      },
      {
        status: 'owned',
        updated_at: '2026-06-01T10:00:00Z',
        is_listened: false,
      },
    ];

    const repo = new SupabaseAnalyticsRepository(buildSupabaseMock(funnelRows));
    const result = await repo.find(userId, startDate, endDate);

    expect(result.markedOwned).toBe(3);
  });

  it('should not count owned rows that were merely listened to this month', async () => {
    const funnelRows: FunnelRow[] = [
      {
        status: 'owned',
        updated_at: '2026-07-10T10:00:00Z',
        is_listened: true,
      },
      {
        status: 'owned',
        updated_at: '2026-06-20T10:00:00Z',
        is_listened: true,
      },
      {
        status: 'owned',
        updated_at: '2026-05-05T10:00:00Z',
        is_listened: true,
      },
      {
        status: 'owned',
        updated_at: '2026-04-15T10:00:00Z',
        is_listened: true,
      },
    ];

    const repo = new SupabaseAnalyticsRepository(buildSupabaseMock(funnelRows));
    const result = await repo.find(userId, startDate, endDate);

    expect(result.markedOwned).toBe(0);
  });

  it('should not count want rows that were merely listened to this month as addedToWant', async () => {
    const funnelRows: FunnelRow[] = [
      {
        status: 'want',
        updated_at: '2026-07-10T10:00:00Z',
        is_listened: true,
      },
      {
        status: 'want',
        updated_at: '2026-06-20T10:00:00Z',
        is_listened: true,
      },
      {
        status: 'want',
        updated_at: '2026-05-05T10:00:00Z',
        is_listened: true,
      },
    ];

    const repo = new SupabaseAnalyticsRepository(buildSupabaseMock(funnelRows));
    const result = await repo.find(userId, startDate, endDate);

    expect(result.addedToWant).toBe(0);
  });
});
