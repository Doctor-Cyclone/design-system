import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { expect, it, vi } from 'vitest';
import { Select } from './Select';
const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue', disabled: true },
  { value: 'svelte', label: 'Svelte' },
];
it('opens with keyboard, skips disabled options and selects without moving DOM focus', async () => {
  const change = vi.fn();
  render(<Select label="Framework" options={options} onValueChange={change} />);
  const user = userEvent.setup();
  await user.tab();
  const input = screen.getByRole('combobox', { name: 'Framework' });
  await user.keyboard('{ArrowDown}');
  expect(input).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(change).toHaveBeenCalledWith('svelte');
  expect(input).toHaveValue('Svelte');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
it('filters, announces no results and closes Escape without committing', async () => {
  render(<Select label="Framework" options={options} defaultValue="react" />);
  const user = userEvent.setup();
  const input = screen.getByRole('combobox');
  await user.click(input);
  await user.type(input, 'sve');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  await user.clear(input);
  await user.type(input, 'missing');
  expect(screen.getByRole('status')).toHaveTextContent('No matching options');
  await user.keyboard('{Escape}');
  expect(input).toHaveValue('React');
});
it('supports controlled values and hidden form serialization', async () => {
  function Demo() {
    const [value, setValue] = useState('react');
    return (
      <form aria-label="Preferences">
        <Select
          label="Framework"
          name="framework"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      </form>
    );
  }
  render(<Demo />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: 'Svelte' }));
  expect(
    new FormData(screen.getByRole('form') as HTMLFormElement).get('framework'),
  ).toBe('svelte');
});
it('does not choose disabled options or open a disabled control', async () => {
  const change = vi.fn();
  const view = render(
    <Select label="Framework" options={options} onValueChange={change} />,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByRole('option', { name: 'Vue' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(<Select label="Framework" options={options} disabled />);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.getByRole('combobox')).toBeDisabled();
});
it('closes on Tab and outside click', async () => {
  render(
    <>
      <Select label="Framework" options={options} />
      <button>Next</button>
    </>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole('combobox'));
  await user.tab();
  expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
it('handles empty and fully disabled option lists with keyboard', async () => {
  const change = vi.fn();
  render(
    <Select
      label="Empty"
      options={options.map((option) => ({ ...option, disabled: true }))}
      onValueChange={change}
    />,
  );
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{ArrowUp}{ArrowDown}{Enter}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox')).not.toHaveAttribute(
    'aria-activedescendant',
  );
});
it('has no structural axe violations while the list is open', async () => {
  const { container } = render(
    <Select
      label="Framework"
      options={options}
      hint="Choose one"
      error="Required"
    />,
  );
  await userEvent.click(screen.getByRole('combobox'));
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});
