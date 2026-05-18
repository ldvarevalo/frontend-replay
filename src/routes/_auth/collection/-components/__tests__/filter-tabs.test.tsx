import { render, screen } from '@test-utils';
import { FilterTabs } from '../filter-tabs';

describe('FilterTabs', () => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'vinyl', label: 'Vinyl' },
    { id: 'cd', label: 'CD' },
  ];

  it('should render all tabs', () => {
    render(<FilterTabs tabs={tabs} activeTab="all" onTabChange={() => {}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Vinyl')).toBeInTheDocument();
    expect(screen.getByText('CD')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    const { container } = render(<FilterTabs tabs={tabs} activeTab="vinyl" onTabChange={() => {}} />);
    const buttons = container.querySelectorAll('button');
    const vinylButton = Array.from(buttons).find(b => b.textContent === 'Vinyl');
    expect(vinylButton).toHaveClass('bg-primary-container');
  });

  it('should fire onTabChange when tab clicked', () => {
    const onTabChange = vi.fn();
    render(<FilterTabs tabs={tabs} activeTab="all" onTabChange={onTabChange} />);
    screen.getByText('Vinyl').click();
    expect(onTabChange).toHaveBeenCalledWith('vinyl');
  });
});
