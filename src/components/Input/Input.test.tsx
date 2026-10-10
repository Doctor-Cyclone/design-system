import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';
describe('Input', () => {
  it('associates label, external description, hint and error', () => {
    render(
      <>
        <p id="extra">Additional information</p>
        <Input
          label="Email"
          hint="Use your work address"
          error="Invalid email"
          aria-describedby="extra"
          required
        />
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAccessibleDescription(
      'Additional information Use your work address Invalid email',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeRequired();
  });
  it('keeps multiple labels distinct and focuses through the label', async () => {
    render(
      <>
        <Input label="First name" />
        <Input label="Last name" />
      </>,
    );
    await userEvent.click(screen.getByText('Last name'));
    expect(screen.getByRole('textbox', { name: 'Last name' })).toHaveFocus();
  });
  it('supports controlled editing', async () => {
    function Example() {
      const [value, setValue] = useState('');
      return (
        <Input
          label="Name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(<Example />);
    await userEvent.type(screen.getByRole('textbox'), 'Kirill');
    expect(screen.getByRole('textbox')).toHaveValue('Kirill');
  });
  it('prevents editing a disabled field', async () => {
    render(<Input label="Name" defaultValue="Read only" disabled />);
    await userEvent.type(screen.getByRole('textbox'), 'changed');
    expect(screen.getByRole('textbox')).toHaveValue('Read only');
  });
});
