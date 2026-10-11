import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
const items = [
  {
    value: 'overview',
    label: 'Overview',
    content: <p>Project overview and recent activity.</p>,
  },
  {
    value: 'settings',
    label: 'Settings',
    content: <p>Change project settings.</p>,
  },
  {
    value: 'billing',
    label: 'Billing',
    content: <p>Billing details.</p>,
    disabled: true,
  },
  { value: 'members', label: 'Members', content: <p>Manage participants.</p> },
];
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { label: 'Project sections', items },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'members' } };
export const Empty: Story = { args: { items: [] } };
export const LongLabels: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      label: `Project ${item.label} and additional configuration`,
    })),
  },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
function ControlledExample() {
  const [value, setValue] = useState('overview');
  return (
    <>
      <Tabs
        label="Controlled sections"
        items={items}
        value={value}
        onValueChange={setValue}
      />
      <p>Selected section: {value}</p>
    </>
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
