import { render, screen } from '@test-utils';
import { OptionGroup } from '../option-group';

describe('OptionGroup', () => {
  const options = ['alpha', 'beta', 'gamma'];

  it('should render label', () => {
    render(
      <OptionGroup
        label="STATUS"
        options={options}
        value={null}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <OptionGroup
        label=""
        options={options}
        value={null}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
    expect(screen.getByText('gamma')).toBeInTheDocument();
  });

  it('should call onChange with selected value', () => {
    const onChange = vi.fn();

    render(
      <OptionGroup
        label=""
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    screen.getByText('gamma').click();

    expect(onChange).toHaveBeenCalledWith('gamma');
  });
});
