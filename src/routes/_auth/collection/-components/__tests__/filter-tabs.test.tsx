import { render, screen } from '@test-utils';
import { FilterTabs, type Tab } from '../filter-tabs';

/**
 * Mocks
 */

const handleTabChangeMock = vi.fn();

/**
 * Tests
 */

describe('FilterTabs', () => {
  const tabs: Tab[] = [
    {
      id: 'all',
      label: 'All',
    },
    {
      id: 'vinyl',
      label: 'Vinyl',
    },
    {
      id: 'cd',
      label: 'CD',
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all tabs', () => {
    render(
      <FilterTabs
        tabs={tabs}
        activeTab="all"
        onTabChange={handleTabChangeMock}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Vinyl')).toBeInTheDocument();
    expect(screen.getByText('CD')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    const { container } = render(
      <FilterTabs
        tabs={tabs}
        activeTab="vinyl"
        onTabChange={handleTabChangeMock}
      />
    );

    const buttons = container.querySelectorAll('button');
    const vinylButton = Array.from(buttons).find(
      button => button.textContent === 'Vinyl'
    );

    expect(vinylButton).toHaveClass('bg-primary-container');
  });

  it('should fire onTabChange when tab clicked', () => {
    render(
      <FilterTabs
        tabs={tabs}
        activeTab="all"
        onTabChange={handleTabChangeMock}
      />
    );

    screen.getByText('Vinyl').click();

    expect(handleTabChangeMock).toHaveBeenCalledWith('vinyl');
  });
});
