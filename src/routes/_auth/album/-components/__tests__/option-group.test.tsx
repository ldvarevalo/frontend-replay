import { render, screen } from '@test-utils';
import { OptionGroup } from '../option-group';

/**
 * Constants
 */

const OPTIONS_MOCK = ['AN.OPTION', 'ANOTHER.OPTION', 'A.THIRD.OPTION'];

/**
 * Tests
 */

describe('OptionGroup', () => {
  it('should render label', () => {
    const { container } = render(
      <OptionGroup
        label="A.LABEL"
        options={OPTIONS_MOCK}
        value={null}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('A.LABEL')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render all options', () => {
    render(
      <OptionGroup
        label="A.LABEL"
        options={OPTIONS_MOCK}
        value={null}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('AN.OPTION')).toBeInTheDocument();
    expect(screen.getByText('ANOTHER.OPTION')).toBeInTheDocument();
    expect(screen.getByText('A.THIRD.OPTION')).toBeInTheDocument();
  });

  it('should call onChange with selected value', () => {
    const handleChangeMock = vi.fn();

    render(
      <OptionGroup
        label="A.LABEL"
        options={OPTIONS_MOCK}
        value={null}
        onChange={handleChangeMock}
      />
    );

    screen.getByText('A.THIRD.OPTION').click();

    expect(handleChangeMock).toHaveBeenCalledWith('A.THIRD.OPTION');
  });
});
