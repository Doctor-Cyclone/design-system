import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Modal } from './Modal';
import { Select } from '../Select';
function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Launch</button>
      <Modal
        open={open}
        title="Settings"
        description="Update your preferences"
        onClose={() => setOpen(false)}
      >
        <button>First action</button>
        <button>Last action</button>
      </Modal>
    </>
  );
}
it('moves and traps focus, isolates background, locks scroll and restores the opener', async () => {
  const user = userEvent.setup();
  const { container } = render(<Demo />);
  const opener = screen.getByRole('button', { name: 'Launch' });
  await user.click(opener);
  const dialog = screen.getByRole('dialog', { name: 'Settings' });
  expect(dialog).toHaveAccessibleDescription('Update your preferences');
  expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  expect(container).toHaveAttribute('inert');
  expect(document.body.style.overflow).toBe('hidden');
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(screen.getByRole('button', { name: 'Last action' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
  opener.focus();
  expect(dialog).toContainElement(document.activeElement as HTMLElement);
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
  expect(container).not.toHaveAttribute('inert');
  expect(document.body.style.overflow).toBe('');
});
it('closes only on the overlay when allowed', () => {
  const close = vi.fn();
  const view = render(
    <Modal open title="Settings" onClose={close}>
      <p>Content</p>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog');
  fireEvent.pointerDown(dialog);
  expect(close).not.toHaveBeenCalled();
  fireEvent.pointerDown(dialog.parentElement!);
  expect(close).toHaveBeenCalledOnce();
  view.rerender(
    <Modal open title="Settings" onClose={close} closeOnOverlay={false}>
      <p>Content</p>
    </Modal>,
  );
  fireEvent.pointerDown(screen.getByRole('dialog').parentElement!);
  expect(close).toHaveBeenCalledOnce();
});
it('restores pre-existing document state when unmounted', () => {
  document.body.style.overflow = 'clip';
  const background = document.createElement('div');
  background.setAttribute('inert', '');
  document.body.append(background);
  const { unmount } = render(
    <Modal open title="Settings" onClose={() => {}}>
      Content
    </Modal>,
  );
  unmount();
  expect(background).toHaveAttribute('inert');
  expect(document.body.style.overflow).toBe('clip');
  background.remove();
  document.body.style.overflow = '';
});
it('isolates newly inserted background content', async () => {
  render(
    <Modal open title="Settings" onClose={() => {}}>
      Content
    </Modal>,
  );
  const extra = document.createElement('div');
  document.body.append(extra);
  await vi.waitFor(() => expect(extra).toHaveAttribute('inert'));
  extra.remove();
});
it('closes a Select popup before dismissing its dialog', async () => {
  const close = vi.fn();
  render(
    <Modal open title="Settings" onClose={close}>
      <Select
        label="Framework"
        options={[{ value: 'react', label: 'React' }]}
      />
    </Modal>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(close).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(close).toHaveBeenCalledOnce();
});
it('keeps a parent modal isolated when a nested modal closes', async () => {
  function Nested() {
    const [inner, setInner] = useState(false);
    return (
      <Modal open title="Parent" onClose={() => {}}>
        <button onClick={() => setInner(true)}>Nested</button>
        <Modal open={inner} title="Child" onClose={() => setInner(false)}>
          Child content
        </Modal>
      </Modal>
    );
  }
  render(<Nested />);
  const user = userEvent.setup();
  const opener = screen.getByRole('button', { name: 'Nested' });
  await user.click(opener);
  expect(screen.getByRole('dialog', { name: 'Child' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(
    screen.queryByRole('dialog', { name: 'Child' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('dialog', { name: 'Parent' })).toBeInTheDocument();
  expect(opener).toHaveFocus();
  expect(document.body.style.overflow).toBe('hidden');
});
