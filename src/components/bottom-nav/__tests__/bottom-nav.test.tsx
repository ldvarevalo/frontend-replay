import { render, screen } from '@test-utils';
import { BottomNav } from '../bottom-nav';

describe('BottomNav', () => {
  it('should render all tabs', () => {
    render(<BottomNav activeTab="home" />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Collection')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    const { container } = render(<BottomNav activeTab="collection" />);

    const links = container.querySelectorAll('a');
    const collectionLink = Array.from(links).find(link =>
      link.textContent?.includes('Collection')
    );

    expect(collectionLink).toHaveClass('text-primary');
  });
});
