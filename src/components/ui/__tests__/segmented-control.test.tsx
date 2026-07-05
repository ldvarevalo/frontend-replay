import { render, screen } from '@test-utils';
import { SegmentedControl } from '../segmented-control';

describe('SegmentedControl', () => {
  const options = ['option-a', 'option-b', 'option-c'];

  it('should render label', () => {
    render(
      <SegmentedControl
        label="MY LABEL"
        options={options}
        value={null}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('MY LABEL')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(
      <SegmentedControl
        label=""
        options={options}
        value={null}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('option-a')).toBeInTheDocument();
    expect(screen.getByText('option-b')).toBeInTheDocument();
    expect(screen.getByText('option-c')).toBeInTheDocument();
  });

  it('should call onChange with option value on click', () => {
    const onChange = vi.fn();

    render(
      <SegmentedControl
        label=""
        options={options}
        value={null}
        onChange={onChange}
      />
    );

    screen.getByText('option-b').click();

    expect(onChange).toHaveBeenCalledWith('option-b');
  });
});
