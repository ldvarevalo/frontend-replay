import { render, screen } from '@test-utils';
import { BannerCta } from '../banner-cta';

/**
 * Mocks
 */

const handleClickMock = vi.fn();

/**
 * Tests
 */

describe('BannerCta', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render count and records waiting text', () => {
    render(<BannerCta count={5} onClick={handleClickMock} />);

    expect(screen.getByText('5 records waiting')).toBeInTheDocument();
    expect(screen.getByText('WHISHLIST')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    render(<BannerCta count={5} onClick={handleClickMock} />);

    screen.getByText('5 records waiting').closest('button')?.click();

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
