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

  it('should render count and items waiting text', () => {
    render(<BannerCta count={5} onClick={handleClickMock} />);

    expect(screen.getByText('5 items waiting')).toBeInTheDocument();
    expect(screen.getByText('WANT TO LISTEN')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    render(<BannerCta count={5} onClick={handleClickMock} />);

    screen.getByText('5 items waiting').closest('button')?.click();

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });
});
