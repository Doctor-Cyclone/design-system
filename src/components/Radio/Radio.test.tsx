import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Radio } from './Radio';
it('navigates a native group with arrow keys and skips disabled options', async () => {
  render(
    <fieldset>
      <legend>Plan</legend>
      <Radio label="Free" name="plan" value="free" defaultChecked />
      <Radio label="Unavailable" name="plan" value="unavailable" disabled />
      <Radio label="Pro" name="plan" value="pro" />
    </fieldset>,
  );
  const user = userEvent.setup();
  await user.tab();
  expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
});
it('supports a controlled group', async () => {
  function Demo() {
    const [value, setValue] = useState('free');
    return (
      <>
        {['free', 'pro'].map((option) => (
          <Radio
            key={option}
            label={option}
            name="controlled"
            value={option}
            checked={value === option}
            onChange={(event) => setValue(event.target.value)}
          />
        ))}
      </>
    );
  }
  render(<Demo />);
  await userEvent.click(screen.getByRole('radio', { name: 'pro' }));
  expect(screen.getByRole('radio', { name: 'pro' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'free' })).not.toBeChecked();
});
