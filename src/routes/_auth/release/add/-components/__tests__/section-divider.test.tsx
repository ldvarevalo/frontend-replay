import { render, screen } from '@test-utils';
import { SectionDivider } from '../section-divider';

describe('SectionDivider', () => {
  it('should render label text', () => {
    render(<SectionDivider label="SEARCH RESULTS" />);

    expect(screen.getByText('SEARCH RESULTS')).toBeInTheDocument();
  });
});
