import { render, screen } from '@test-utils';
import { SectionHeader } from '../section-header';

/**
 * Mocks
 */

const handleLinkClickMock = vi.fn();

/**
 * Tests
 */

describe('SectionHeader', () => {
  it('should render title', () => {
    render(<SectionHeader title="My Section" />);

    expect(screen.getByText('My Section')).toBeInTheDocument();
  });

  it('should render link button when onLinkClick provided', () => {
    render(
      <SectionHeader title="My Section" onLinkClick={handleLinkClickMock} />
    );

    expect(screen.getByText('VIEW ALL')).toBeInTheDocument();
  });

  it('should use custom linkLabel when provided', () => {
    render(
      <SectionHeader
        title="My Section"
        onLinkClick={handleLinkClickMock}
        linkLabel="SHOW MORE"
      />
    );

    expect(screen.getByText('SHOW MORE')).toBeInTheDocument();
  });

  it('should not render link button when onLinkClick is undefined', () => {
    render(<SectionHeader title="My Section" />);

    expect(screen.queryByText('VIEW ALL')).not.toBeInTheDocument();
  });
});
