import type { Track } from '#/types/domain';
import { groupTracksBySide, sumTrackDurations } from '../tracks-by-side';

/**
 * groupTracksBySide
 */

describe('groupTracksBySide', () => {
  it('should return empty object for empty input', () => {
    expect(groupTracksBySide([])).toEqual({});
  });

  it('should group tracks by side', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A1',
        durationSeconds: 60,
        side: 'side_a',
        position: 1,
      },
      {
        id: '2',
        title: 'B1',
        durationSeconds: 90,
        side: 'side_b',
        position: 1,
      },
    ];

    const result = groupTracksBySide(tracks);

    expect(result.side_a).toHaveLength(1);
    expect(result.side_b).toHaveLength(1);
    expect(result.side_a[0].id).toBe('1');
    expect(result.side_b[0].id).toBe('2');
  });

  it('should sort tracks within each side by position ascending', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A3',
        durationSeconds: null,
        side: 'side_a',
        position: 3,
      },
      {
        id: '2',
        title: 'A1',
        durationSeconds: null,
        side: 'side_a',
        position: 1,
      },
      {
        id: '3',
        title: 'A2',
        durationSeconds: null,
        side: 'side_a',
        position: 2,
      },
    ];

    const result = groupTracksBySide(tracks);

    expect(result.side_a.map(t => t.id)).toEqual(['2', '3', '1']);
  });

  it('should only include sides that have tracks', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A1',
        durationSeconds: null,
        side: 'side_a',
        position: 1,
      },
    ];

    const result = groupTracksBySide(tracks);

    expect(result).toHaveProperty('side_a');
    expect(result).not.toHaveProperty('side_b');
  });
});

/**
 * sumTrackDurations
 */

describe('sumTrackDurations', () => {
  it('should return 0 for empty input', () => {
    expect(sumTrackDurations([])).toBe(0);
  });

  it('should sum all durationSeconds', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A',
        durationSeconds: 60,
        side: 'side_a',
        position: 1,
      },
      {
        id: '2',
        title: 'B',
        durationSeconds: 90,
        side: 'side_a',
        position: 2,
      },
      {
        id: '3',
        title: 'C',
        durationSeconds: 30,
        side: 'side_b',
        position: 1,
      },
    ];

    expect(sumTrackDurations(tracks)).toBe(180);
  });

  it('should treat null durationSeconds as 0', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A',
        durationSeconds: null,
        side: 'side_a',
        position: 1,
      },
      {
        id: '2',
        title: 'B',
        durationSeconds: 60,
        side: 'side_a',
        position: 2,
      },
    ];

    expect(sumTrackDurations(tracks)).toBe(60);
  });
});
