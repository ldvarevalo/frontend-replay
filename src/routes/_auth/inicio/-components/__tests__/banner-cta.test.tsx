import { render, screen } from '@test-utils';
import { BannerCta } from '../banner-cta';

describe('BannerCta', () => {
  it('should render count and items waiting text', () => {
    render(<BannerCta count={5} onClick={() => {}} />);
    expect(screen.getByText('5 items waiting')).toBeInTheDocument();
    expect(screen.getByText('WANT TO LISTEN')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    const onClick = vi.fn();
    render(<BannerCta count={5} onClick={onClick} />);
    screen.getByText('5 items waiting').closest('button')?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
