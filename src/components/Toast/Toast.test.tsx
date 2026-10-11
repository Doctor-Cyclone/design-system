import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ToastProvider } from './Toast';
import { toast } from './toastStore';
beforeEach(() => {
  vi.useFakeTimers();
  toast.dismiss();
});
afterEach(() => {
  toast.dismiss();
  vi.useRealTimers();
});
it('routes ordinary notifications to polite live regions and errors to assertive ones', () => {
  render(<ToastProvider />);
  act(() => {
    toast.success('Saved');
    toast.info('Update available');
    toast.error('Failed');
  });
  expect(
    within(screen.getByRole('status')).getByText('Saved'),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole('status')).getByText('Update available'),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole('alert')).getByText('Failed'),
  ).toBeInTheDocument();
});
it('auto-closes after the configured duration', () => {
  render(<ToastProvider defaultDuration={1000} />);
  act(() => {
    toast.success('Saved');
  });
  act(() => vi.advanceTimersByTime(999));
  expect(screen.getByText('Saved')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByText('Saved')).not.toBeInTheDocument();
});
it('pauses on hover and resumes with the remaining time', () => {
  render(<ToastProvider defaultDuration={1000} />);
  act(() => {
    toast.info('Update');
  });
  act(() => vi.advanceTimersByTime(400));
  const card = screen.getByText('Update').parentElement!;
  fireEvent.pointerEnter(card);
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('Update')).toBeInTheDocument();
  fireEvent.pointerLeave(card);
  act(() => vi.advanceTimersByTime(599));
  expect(screen.getByText('Update')).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByText('Update')).not.toBeInTheDocument();
});
it('does not auto-close while a dismiss button has focus', () => {
  render(<ToastProvider defaultDuration={1000} />);
  act(() => {
    toast.info('Update');
  });
  fireEvent.focus(
    screen.getByRole('button', { name: 'Dismiss notification: Update' }),
  );
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText('Update')).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole('button', { name: 'Dismiss notification: Update' }),
  );
  expect(screen.queryByText('Update')).not.toBeInTheDocument();
});
it('supports persistent messages, individual dismissal and dismiss all', () => {
  render(<ToastProvider />);
  let id = '';
  act(() => {
    id = toast.success('Persistent', { duration: 0 });
    toast.info('Second', { duration: 0 });
  });
  act(() => vi.advanceTimersByTime(60000));
  expect(screen.getByText('Persistent')).toBeInTheDocument();
  act(() => toast.dismiss(id));
  expect(screen.queryByText('Persistent')).not.toBeInTheDocument();
  expect(screen.getByText('Second')).toBeInTheDocument();
  act(() => toast.dismiss());
  expect(screen.queryByText('Second')).not.toBeInTheDocument();
});
it('clears active timers when the provider unmounts', () => {
  const view = render(<ToastProvider />);
  act(() => {
    toast.success('Saved');
  });
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
