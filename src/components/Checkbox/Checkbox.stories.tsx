import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Accept terms' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Select all items' },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};
function ControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Subscribe to updates"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const LongLabel: Story = {
  args: {
    label:
      'I agree to receive project updates and important service notifications by email',
  },
};
