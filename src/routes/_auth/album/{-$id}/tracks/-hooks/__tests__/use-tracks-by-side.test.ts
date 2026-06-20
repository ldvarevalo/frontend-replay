import { renderHook } from '@test-utils';
import type { Track } from '#/types/domain';
import { useTracksBySide } from '../use-tracks-by-side';

/**
 * useTracksBySide
 */

describe('useTracksBySide', () => {
  it('should return empty bySide and zero totals for empty input', () => {
    const { result } = renderHook(() => useTracksBySide([]));

    expect(result.current.bySide).toEqual({});
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalDurationSeconds).toBe(0);
    expect(result.current.sideSummaries).toEqual({});
  });

  it('should group tracks by side and compute total count and duration', () => {
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
        title: 'A2',
        durationSeconds: 90,
        side: 'side_a',
        position: 2,
      },
      {
        id: '3',
        title: 'B1',
        durationSeconds: 30,
        side: 'side_b',
        position: 1,
      },
    ];

    const { result } = renderHook(() => useTracksBySide(tracks));

    expect(result.current.totalCount).toBe(3);
    expect(result.current.totalDurationSeconds).toBe(180);
    expect(result.current.bySide.side_a).toHaveLength(2);
    expect(result.current.bySide.side_b).toHaveLength(1);
  });

  it('should compute sideSummaries per side with count and duration', () => {
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
        title: 'A2',
        durationSeconds: null,
        side: 'side_a',
        position: 2,
      },
      {
        id: '3',
        title: 'B1',
        durationSeconds: 30,
        side: 'side_b',
        position: 1,
      },
    ];

    const { result } = renderHook(() => useTracksBySide(tracks));

    expect(result.current.sideSummaries.side_a).toEqual({
      count: 2,
      durationSeconds: 60,
    });
    expect(result.current.sideSummaries.side_b).toEqual({
      count: 1,
      durationSeconds: 30,
    });
  });

  it('should not include sides with no tracks in bySide or sideSummaries', () => {
    const tracks: Track[] = [
      {
        id: '1',
        title: 'A1',
        durationSeconds: 60,
        side: 'side_a',
        position: 1,
      },
    ];

    const { result } = renderHook(() => useTracksBySide(tracks));

    expect(result.current.bySide).not.toHaveProperty('side_b');
    expect(result.current.sideSummaries).not.toHaveProperty('side_b');
  });
});
