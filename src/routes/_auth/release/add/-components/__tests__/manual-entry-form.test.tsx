import { render, screen } from '@test-utils';
import type { ManualEntryData } from '../../-hooks/use-manual-entry';
import { ManualEntryForm } from '../manual-entry-form';

/**
 * Mocks
 */

const handleFieldChangeMock = vi.fn();
const handleSubmitMock = vi.fn();

/**
 * Tests
 */

describe('ManualEntryForm', () => {
  const defaultValues: ManualEntryData = {
    title: '',
    artist: '',
    year: '',
    genre: '',
    artworkUrl: '',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all fields', () => {
    render(
      <ManualEntryForm
        values={defaultValues}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={false}
      />
    );

    expect(
      screen.getByPlaceholderText('e.g. A Love Supreme')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('e.g. John Coltrane')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1965')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Jazz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
  });

  it('should disable submit button when isValid is false', () => {
    render(
      <ManualEntryForm
        values={defaultValues}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={false}
      />
    );

    expect(screen.getByText('SAVE')).toBeDisabled();
  });

  it('should enable submit button when isValid is true', () => {
    render(
      <ManualEntryForm
        values={defaultValues}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={true}
      />
    );

    expect(screen.getByText('SAVE')).not.toBeDisabled();
  });

  it('should call onSubmit when save button clicked', () => {
    render(
      <ManualEntryForm
        values={defaultValues}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={true}
      />
    );

    screen.getByText('SAVE').click();

    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('should show artwork preview with artworkUrl value', () => {
    const values = {
      ...defaultValues,
      artworkUrl: 'https://example.com/art.jpg',
    };

    render(
      <ManualEntryForm
        values={values}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={false}
      />
    );

    expect(screen.getByAltText('Artwork preview')).toHaveAttribute(
      'src',
      'https://example.com/art.jpg'
    );
  });
});
