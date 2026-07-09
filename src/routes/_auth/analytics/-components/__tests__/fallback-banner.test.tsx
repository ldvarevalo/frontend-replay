import { render, screen } from '@test-utils';
import { FallbackBanner } from '../fallback-banner';

/**
 * Tests
 */

describe('FallbackBanner', () => {
  it('should render message with the given period', () => {
    render(<FallbackBanner period="last-month" />);

    expect(screen.getByText(/Last Month/)).toBeInTheDocument();
  });
});
