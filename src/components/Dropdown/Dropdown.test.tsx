import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';
function items(action = vi.fn()) {
  return [
    { id: 'edit', label: 'Edit', onSelect: action },
    { id: 'disabled', label: 'Archive', disabled: true, onSelect: action },
    { id: 'delete', label: 'Delete', onSelect: action },
    { id: 'export', label: 'Export', onSelect: action },
  ];
}
it('opens with arrows, skips disabled items, wraps and activates with Enter', async () => {
  const action = vi.fn();
  render(<Dropdown label="Actions" items={items(action)} />);
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  await user.keyboard('{End}{ArrowDown}');
  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(action).toHaveBeenCalledOnce();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
});
it('opens at the last item with ArrowUp and returns focus on Escape', async () => {
  render(<Dropdown label="Actions" items={items()} />);
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus();
  await user.keyboard('{Home}{Escape}');
  expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
it('supports typeahead and Tab exits the menu', async () => {
  render(
    <>
      <Dropdown label="Actions" items={items()} />
      <button>Next</button>
    </>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  await user.keyboard('d');
  expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
it('closes on a pointer event outside without stealing focus', async () => {
  render(<Dropdown label="Actions" items={items()} />);
  await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
it('blocks disabled items and disables a menu with no available actions', async () => {
  const action = vi.fn();
  const view = render(<Dropdown label="Actions" items={items(action)} />);
  await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
  await userEvent.click(screen.getByRole('menuitem', { name: 'Archive' }));
  expect(action).not.toHaveBeenCalled();
  view.rerender(<Dropdown label="Actions" items={[]} />);
  expect(screen.getByRole('button', { name: 'Actions' })).toBeDisabled();
});
