import { render, screen } from '@test-utils';
import { TracksSummary } from '../tracks-summary';

/**
 * TracksSummary
 */

describe('TracksSummary', () => {
  it('should render total count and formatted duration', () => {
    render(<TracksSummary totalCount={12} totalDurationSeconds={2730} />);

    expect(screen.getByText(/12 tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/45:30/)).toBeInTheDocument();
  });

  it('should not render when totalCount is 0', () => {
    const { container } = render(
      <TracksSummary totalCount={0} totalDurationSeconds={0} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
