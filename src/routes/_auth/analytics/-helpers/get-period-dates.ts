export type Period = 'this-month' | 'last-month' | 'this-year' | 'all-time';

export interface GetPeriodDatesResult {
  start: string;
  end: string;
}

export const getPeriodDates = (period: Period): GetPeriodDatesResult => {
  const now = new Date();

  switch (period) {
    case 'this-month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        start: start.toISOString(),
        end: now.toISOString(),
      };
    }
    case 'last-month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      return {
        start: start.toISOString(),
        end: end.toISOString(),
      };
    }
    case 'this-year': {
      const start = new Date(now.getFullYear(), 0, 1);

      return {
        start: start.toISOString(),
        end: now.toISOString(),
      };
    }
    case 'all-time': {
      return {
        start: '1970-01-01T00:00:00Z',
        end: now.toISOString(),
      };
    }
  }
};
