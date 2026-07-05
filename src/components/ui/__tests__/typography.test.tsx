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

  it('should apply display variant defaults', () => {
    const { container } = render(
      <Typography variant="display">Display Title</Typography>
    );

    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveClass('font-heading');
  });

  it('should apply label variant defaults', () => {
    const { container } = render(
      <Typography variant="label">LABEL</Typography>
    );

    expect(container.querySelector('label')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveClass('uppercase');
  });

  it('should override variant with individual props', () => {
    const { container } = render(
      <Typography variant="label" family="heading">
        OVERRIDE
      </Typography>
    );

    expect(container.querySelector('label')).toHaveClass('font-heading');
  });
});
