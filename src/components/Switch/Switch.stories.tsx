import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';
const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Enable notifications' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true },
};
function ControlledExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      label="Automatic updates"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const LongLabel: Story = {
  args: {
    label: 'Receive notifications when other participants update this project',
  },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
