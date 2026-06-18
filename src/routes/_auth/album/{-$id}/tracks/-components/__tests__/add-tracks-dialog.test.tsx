import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@test-utils';
import type { TrackInput } from '#/repositories/types';
import { AddTracksDialog } from '../add-tracks-dialog';

/**
 * Types
 */

interface HarnessProps {
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (tracks: TrackInput[]) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

/**
 * Helpers
 */

const renderDialog = (
  props: Partial<HarnessProps> = {}
): ReturnType<typeof render> => {
  const onOpenChange = props.onOpenChange ?? vi.fn();
  const onSubmit = props.onSubmit ?? vi.fn();
  const isSubmitting = props.isSubmitting ?? false;
  const errorMessage = props.errorMessage ?? null;

  return render(
    <AddTracksDialog
      open={true}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
    />
  );
};

/**
 * AddTracksDialog
 */

describe('AddTracksDialog', () => {
  it('should render with one empty row initially', () => {
    renderDialog();

    expect(screen.getAllByLabelText('Track title')).toHaveLength(1);
  });

  it('should keep SAVE button disabled when title is empty', () => {
    renderDialog();

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('should enable SAVE button when title is filled', () => {
    renderDialog();

    const titleInput = screen.getByLabelText('Track title');
    fireEvent.change(titleInput, { target: { value: 'My Track' } });

    expect(
      screen.getByRole('button', { name: /save/i })
    ).not.toBeDisabled();
  });

  it('should call onSubmit with converted TrackInput[] on SAVE', () => {
    const onSubmit = vi.fn();

    renderDialog({ onSubmit });

    const titleInput = screen.getByLabelText('Track title');
    fireEvent.change(titleInput, { target: { value: 'My Track' } });

    const durationInput = screen.getByLabelText('Track duration');
    fireEvent.change(durationInput, { target: { value: '3:45' } });

    screen.getByRole('button', { name: /save/i }).click();

    expect(onSubmit).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'My Track',
        durationSeconds: 225,
        side: 'side_a',
        position: 1,
      }),
    ]);
  });

  it('should pass null durationSeconds when duration is empty', () => {
    const onSubmit = vi.fn();

    renderDialog({ onSubmit });

    const titleInput = screen.getByLabelText('Track title');
    fireEvent.change(titleInput, { target: { value: 'My Track' } });

    screen.getByRole('button', { name: /save/i }).click();

    expect(onSubmit).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'My Track',
        durationSeconds: null,
      }),
    ]);
  });

  it('should show SAVING text and disable SAVE when isSubmitting', () => {
    renderDialog({ isSubmitting: true });

    const titleInput = screen.getByLabelText('Track title');
    fireEvent.change(titleInput, { target: { value: 'My Track' } });

    const saveButton = screen.getByRole('button', { name: /saving/i });

    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should display errorMessage when provided', () => {
    renderDialog({ errorMessage: 'Network error' });

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('should not display error message when errorMessage is null', () => {
    renderDialog({ errorMessage: null });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should add a new row when + ADD ROW is clicked', () => {
    renderDialog();

    expect(screen.getAllByLabelText('Track title')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: /add row/i }));

    expect(screen.getAllByLabelText('Track title')).toHaveLength(2);
  });

  it('should remove a row when the X button is clicked', () => {
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: /add row/i }));
    expect(screen.getAllByLabelText('Track title')).toHaveLength(2);

    const removeButtons = screen.getAllByLabelText('Remove track');
    fireEvent.click(removeButtons[0]);

    expect(screen.getAllByLabelText('Track title')).toHaveLength(1);
  });

  it('should call onOpenChange with false when CANCEL is clicked', () => {
    const onOpenChange = vi.fn();

    renderDialog({ onOpenChange });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
