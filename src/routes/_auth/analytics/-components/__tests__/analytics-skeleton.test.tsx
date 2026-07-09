import { render } from '@test-utils';
import { AnalyticsSkeleton } from '../analytics-skeleton';

/**
 * Tests
 */

describe('AnalyticsSkeleton', () => {
  it('should render skeleton placeholders', () => {
    const { container } = render(<AnalyticsSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');

    expect(skeletons.length).toBeGreaterThan(0);
  });
});
