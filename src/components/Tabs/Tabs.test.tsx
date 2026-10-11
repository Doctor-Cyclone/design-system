import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Tabs } from './Tabs';
const items = [
  { value: 'one', label: 'One', content: 'First panel' },
  { value: 'two', label: 'Two', content: 'Second panel', disabled: true },
  { value: 'three', label: 'Three', content: 'Third panel' },
];
it('has linked tab semantics and one selected tab in the tab order', () => {
  render(<Tabs label="Sections" items={items} />);
  expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveTextContent(
    'First panel',
  );
  expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute(
    'tabindex',
    '-1',
  );
});
it('navigates automatically with arrows, Home and End while skipping disabled tabs', async () => {
  render(<Tabs label="Sections" items={items} />);
  const user = userEvent.setup();
  await user.tab();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus();
  expect(screen.getByRole('tabpanel', { name: 'Three' })).toBeVisible();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
  await user.keyboard('{End}{Home}');
  expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(screen.getByRole('tab', { name: 'Three' })).toHaveFocus();
});
it('supports controlled selection and leaves the tablist for its panel on Tab', async () => {
  function Demo() {
    const [value, setValue] = useState('one');
    return (
      <Tabs
        label="Sections"
        items={items}
        value={value}
        onValueChange={setValue}
      />
    );
  }
  render(<Demo />);
  const user = userEvent.setup();
  await user.click(screen.getByRole('tab', { name: 'Three' }));
  expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await user.tab();
  expect(screen.getByRole('tabpanel', { name: 'Three' })).toHaveFocus();
});
it('falls back to an available tab when the selected item is removed', () => {
  const view = render(
    <Tabs label="Sections" items={items} defaultValue="three" />,
  );
  view.rerender(
    <Tabs label="Sections" items={items.slice(0, 2)} defaultValue="three" />,
  );
  expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
