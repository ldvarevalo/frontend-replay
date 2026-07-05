import { render, screen } from '@test-utils';

import { CollectionFunnel } from '../collection-funnel';

/**
 * Tests
 */

describe('CollectionFunnel', () => {
  it('should render all funnel stages with counts', () => {
    render(
      <CollectionFunnel
        discover={18}
        listened={12}
        want={4}
        owned={10}
        totalEntered={18}
      />
    );

    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Listened')).toBeInTheDocument();
    expect(screen.getByText('Want')).toBeInTheDocument();
    expect(screen.getByText('Owned')).toBeInTheDocument();
    expect(screen.getByText(/18 albums entered/)).toBeInTheDocument();
  });
});
