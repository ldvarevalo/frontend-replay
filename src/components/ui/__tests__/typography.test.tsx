import { render, screen } from '@test-utils';
import { Typography } from '../typography';

describe('Typography', () => {
  it('should render children', () => {
    render(<Typography>Hello</Typography>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render as specified HTML element', () => {
    const { container } = render(<Typography as="h1">Title</Typography>);

    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('should render default element based on family', () => {
    const { container } = render(
      <Typography family="heading">Title</Typography>
    );

    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it('should apply variant class', () => {
    const { container } = render(<Typography size="lg">Text</Typography>);

    expect(container.querySelector('p')).toHaveClass('text-xl');
  });

  it('should apply uppercase when uppercase prop is true', () => {
    const { container } = render(<Typography uppercase>Text</Typography>);

    expect(container.querySelector('p')).toHaveClass('uppercase');
  });
});
