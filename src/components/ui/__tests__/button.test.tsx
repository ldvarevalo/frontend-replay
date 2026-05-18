import { render, screen } from '@test-utils';
import { Button } from '../button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>CLICK ME</Button>);

    expect(screen.getByText('CLICK ME')).toBeInTheDocument();
  });

  it('should fire onClick when clicked', () => {
    const handleClickMock = vi.fn();

    render(<Button onClick={handleClickMock}>CLICK ME</Button>);
    screen.getByText('CLICK ME').click();

    expect(handleClickMock).toHaveBeenCalledTimes(1);
  });

  it('should apply variant class', () => {
    const { container } = render(<Button variant="primary">CLICK ME</Button>);

    expect(container.querySelector('button')).toHaveClass(
      'bg-primary-container'
    );
  });

  it('should apply size class', () => {
    const { container } = render(<Button size="lg">CLICK ME</Button>);

    expect(container.querySelector('button')).toHaveClass('h-16');
  });
});
