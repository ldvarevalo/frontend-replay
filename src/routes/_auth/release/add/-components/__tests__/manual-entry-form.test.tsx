import { render, screen } from '@test-utils';
import type { ManualEntryData } from '#/types/domain';
import { ManualEntryForm } from '../manual-entry-form';
import type { ManualEntryFormProps } from '../manual-entry-form';

/**
 * Mocks
 */

const handleFieldChangeMock = vi.fn();
const handleSubmitMock = vi.fn();

const createSearchMock = (): ManualEntryFormProps['artistSearch'] => ({
  results: [],
  isSearching: false,
  onSearch: vi.fn(),
});

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
    status: 'want',
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
        artistSearch={createSearchMock()}
        genreSearch={createSearchMock()}
      />
    );

    expect(
      screen.getByPlaceholderText('e.g. A Love Supreme')
    ).toBeInTheDocument();
    expect(screen.getByText('e.g. John Coltrane')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1965')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
  });

  it('should disable submit button when isValid is false', () => {
    render(
      <ManualEntryForm
        values={defaultValues}
        onFieldChange={handleFieldChangeMock}
        onSubmit={handleSubmitMock}
        isValid={false}
        artistSearch={createSearchMock()}
        genreSearch={createSearchMock()}
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
        artistSearch={createSearchMock()}
        genreSearch={createSearchMock()}
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
        artistSearch={createSearchMock()}
        genreSearch={createSearchMock()}
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
        artistSearch={createSearchMock()}
        genreSearch={createSearchMock()}
      />
    );

    expect(screen.getByAltText('Artwork preview')).toHaveAttribute(
      'src',
      'https://example.com/art.jpg'
    );
  });
});
