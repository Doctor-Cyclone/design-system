import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
it('toggles an uncontrolled checkbox with Space and the label', async () => {
  render(<Checkbox label="Accept" />);
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard(' ');
  expect(screen.getByRole('checkbox')).toBeChecked();
  await user.click(screen.getByText('Accept'));
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
it('supports a controlled checkbox', async () => {
  function Demo() {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Accept"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  }
  render(<Demo />);
  await userEvent.click(screen.getByRole('checkbox'));
  expect(screen.getByRole('checkbox')).toBeChecked();
});
it('does not change a disabled checkbox', async () => {
  const change = vi.fn();
  render(<Checkbox label="Accept" disabled onChange={change} />);
  await userEvent.click(screen.getByText('Accept'));
  expect(change).not.toHaveBeenCalled();
});
it('exposes an indeterminate state', () => {
  render(<Checkbox label="Select all" indeterminate />);
  expect(screen.getByRole('checkbox')).toBePartiallyChecked();
});
