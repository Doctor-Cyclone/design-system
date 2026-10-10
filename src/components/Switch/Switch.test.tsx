import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Switch } from './Switch';
it('toggles with Space and has an accessible label', async () => {
  render(<Switch label="Notifications" />);
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveFocus();
  await user.keyboard(' ');
  expect(screen.getByRole('switch')).toBeChecked();
});
it('supports controlled values', async () => {
  function Demo() {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        label="Notifications"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  }
  render(<Demo />);
  await userEvent.click(screen.getByRole('switch'));
  expect(screen.getByRole('switch')).not.toBeChecked();
});
it('blocks disabled interaction', async () => {
  const change = vi.fn();
  render(<Switch label="Notifications" disabled onChange={change} />);
  await userEvent.click(screen.getByText('Notifications'));
  expect(change).not.toHaveBeenCalled();
});
