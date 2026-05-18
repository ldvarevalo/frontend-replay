import { render, screen } from '@test-utils';
import { ArtworkPreview } from '../artwork-preview';

describe('ArtworkPreview', () => {
  it('should render image when URL starts with http', () => {
    render(<ArtworkPreview imageUrl="https://example.com/art.jpg" />);
    const img = screen.getByAltText('Artwork preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/art.jpg');
  });

  it('should render placeholder when URL is not valid', () => {
    render(<ArtworkPreview imageUrl="" />);
    expect(screen.getByText('PREVIEW')).toBeInTheDocument();
    expect(screen.queryByAltText('Artwork preview')).not.toBeInTheDocument();
  });
});
