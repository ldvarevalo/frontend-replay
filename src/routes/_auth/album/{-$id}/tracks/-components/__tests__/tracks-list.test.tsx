import { render, screen } from '@test-utils';
import type { Track } from '#/types/domain';
import { TracksList } from '../tracks-list';

/**
 * Mocks
 *
 * No se mockea `listening-scope-labels` — se prefiere usar el helper real
 * porque `LISTENING_SCOPE_LABELS` ya contiene los labels esperados
 * (`'Side A'`, `'Side B'`, etc.). Como es `const`, no se puede `spyOn`
 * directamente; usar el valor real es más simple y evita duplicación.
 */

/**
 * TracksList
 */

describe('TracksList', () => {
  it('should render a section header per side with side label and duration', () => {
    const bySide: Record<string, Track[]> = {
      side_a: [
        {
          id: '1',
          title: 'Track One',
          durationSeconds: 225,
          side: 'side_a',
          position: 1,
        },
        {
          id: '2',
          title: 'Track Two',
          durationSeconds: 120,
          side: 'side_a',
          position: 2,
        },
      ],
      side_b: [
        {
          id: '3',
          title: 'Track Three',
          durationSeconds: 100,
          side: 'side_b',
          position: 1,
        },
        {
          id: '4',
          title: 'Track Four',
          durationSeconds: 80,
          side: 'side_b',
          position: 2,
        },
      ],
    };

    render(<TracksList bySide={bySide} />);

    expect(screen.getByText('Side A')).toBeInTheDocument();
    expect(screen.getByText('Side B')).toBeInTheDocument();
    expect(screen.getByText('5:45')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
    expect(screen.getByText('3:45')).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
    expect(screen.getByText('1:40')).toBeInTheDocument();
    expect(screen.getByText('1:20')).toBeInTheDocument();
  });

  it('should render each track with title and formatted duration', () => {
    const bySide: Record<string, Track[]> = {
      side_a: [
        {
          id: '1',
          title: 'Track One',
          durationSeconds: 225,
          side: 'side_a',
          position: 1,
        },
        {
          id: '2',
          title: 'Track Two',
          durationSeconds: 120,
          side: 'side_a',
          position: 2,
        },
      ],
    };

    render(<TracksList bySide={bySide} />);

    expect(screen.getByText('Track One')).toBeInTheDocument();
    expect(screen.getByText('Track Two')).toBeInTheDocument();
    expect(screen.getByText('3:45')).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('should render tracks within each side in array order', () => {
    const bySide: Record<string, Track[]> = {
      side_a: [
        {
          id: '1',
          title: 'First',
          durationSeconds: null,
          side: 'side_a',
          position: 1,
        },
        {
          id: '2',
          title: 'Second',
          durationSeconds: null,
          side: 'side_a',
          position: 2,
        },
        {
          id: '3',
          title: 'Third',
          durationSeconds: null,
          side: 'side_a',
          position: 3,
        },
      ],
    };

    render(<TracksList bySide={bySide} />);

    const trackTitles = screen.getAllByText(/^(First|Second|Third)$/);
    expect(trackTitles[0]).toHaveTextContent('First');
    expect(trackTitles[1]).toHaveTextContent('Second');
    expect(trackTitles[2]).toHaveTextContent('Third');
  });

  it('should render nothing when bySide is empty', () => {
    const { container } = render(<TracksList bySide={{}} />);

    expect(container).toBeEmptyDOMElement();
  });
});
