import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';
afterEach(() => vi.useRealTimers());
it('appears on keyboard focus and links the description to its trigger', async () => {
  render(
    <Tooltip content="Save all changes" delay={0}>
      <button>Save</button>
    </Tooltip>,
  );
  await userEvent.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent(
    'Save all changes',
  );
  expect(screen.getByRole('button')).toHaveAccessibleDescription(
    'Save all changes',
  );
});
it('honors hover delay, remains hoverable and closes after pointer leave', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help" delay={300}>
      <button>More</button>
    </Tooltip>,
  );
  const wrapper = screen.getByRole('button').parentElement!;
  fireEvent.pointerEnter(wrapper);
  act(() => vi.advanceTimersByTime(299));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  fireEvent.pointerLeave(wrapper);
  act(() => vi.advanceTimersByTime(50));
  fireEvent.pointerEnter(wrapper);
  act(() => vi.advanceTimersByTime(100));
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  fireEvent.pointerLeave(wrapper);
  act(() => vi.advanceTimersByTime(100));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
it('preserves existing descriptions and handlers and consumes Escape', () => {
  vi.useFakeTimers();
  const focus = vi.fn();
  const key = vi.fn();
  render(
    <>
      <p id="existing">Existing hint</p>
      <Tooltip content="Extra hint" delay={0}>
        <button aria-describedby="existing" onFocus={focus} onKeyDown={key}>
          Save
        </button>
      </Tooltip>
    </>,
  );
  const button = screen.getByRole('button');
  fireEvent.focus(button);
  act(() => vi.advanceTimersByTime(0));
  expect(button).toHaveAccessibleDescription('Existing hint Extra hint');
  expect(focus).toHaveBeenCalledOnce();
  fireEvent.keyDown(button, { key: 'Escape' });
  expect(key).toHaveBeenCalledOnce();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(button).toHaveAccessibleDescription('Existing hint');
});
it('does not reopen after Escape until focus and hover leave', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help" delay={0}>
      <button>More</button>
    </Tooltip>,
  );
  const button = screen.getByRole('button');
  fireEvent.focus(button);
  act(() => vi.advanceTimersByTime(0));
  fireEvent.keyDown(button, { key: 'Escape' });
  fireEvent.pointerEnter(button.parentElement!);
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  fireEvent.pointerLeave(button.parentElement!);
  fireEvent.blur(button);
  act(() => vi.advanceTimersByTime(100));
  fireEvent.focus(button);
  act(() => vi.advanceTimersByTime(0));
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
});
it('clears a pending delay on unmount', () => {
  vi.useFakeTimers();
  const view = render(
    <Tooltip content="Help">
      <button>More</button>
    </Tooltip>,
  );
  fireEvent.focus(screen.getByRole('button'));
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
