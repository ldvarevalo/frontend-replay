import { render, screen } from '@test-utils';
import { ManualEntryForm } from '../manual-entry-form';

describe('ManualEntryForm', () => {
  const defaultValues = {
    title: '',
    artist: '',
    year: '',
    genre: '',
    artworkUrl: '',
  };

  it('should render all fields', () => {
    render(<ManualEntryForm values={defaultValues} onFieldChange={() => {}} onSubmit={() => {}} isValid={false} />);
    expect(screen.getByPlaceholderText('e.g. A Love Supreme')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John Coltrane')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1965')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Jazz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
  });

  it('should disable submit button when isValid is false', () => {
    render(<ManualEntryForm values={defaultValues} onFieldChange={() => {}} onSubmit={() => {}} isValid={false} />);
    expect(screen.getByText('SAVE')).toBeDisabled();
  });

  it('should enable submit button when isValid is true', () => {
    render(<ManualEntryForm values={defaultValues} onFieldChange={() => {}} onSubmit={() => {}} isValid={true} />);
    expect(screen.getByText('SAVE')).not.toBeDisabled();
  });

  it('should call onSubmit when save button clicked', () => {
    const onSubmit = vi.fn();
    render(<ManualEntryForm values={defaultValues} onFieldChange={() => {}} onSubmit={onSubmit} isValid={true} />);
    screen.getByText('SAVE').click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should show artwork preview with artworkUrl value', () => {
    const values = { ...defaultValues, artworkUrl: 'https://example.com/art.jpg' };
    render(<ManualEntryForm values={values} onFieldChange={() => {}} onSubmit={() => {}} isValid={false} />);
    expect(screen.getByAltText('Artwork preview')).toHaveAttribute('src', 'https://example.com/art.jpg');
  });
});
