import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
const items = [
  { id: 'edit', label: 'Edit project', onSelect: () => {} },
  { id: 'archive', label: 'Archive', onSelect: () => {}, disabled: true },
  { id: 'delete', label: 'Delete project', onSelect: () => {}, danger: true },
];
const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: { label: 'Project actions', items },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { items: [] } };
export const AllDisabled: Story = {
  args: { items: items.map((item) => ({ ...item, disabled: true })) },
};
export const LongLabels: Story = {
  args: {
    items: [
      {
        id: 'long',
        label:
          'Duplicate this project and include all of its settings and current participants',
        onSelect: () => {},
      },
      ...items,
    ],
  },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
function ActionsExample() {
  const [action, setAction] = useState('None');
  return (
    <>
      <Dropdown
        label="Choose action"
        items={items.map((item) => ({
          ...item,
          onSelect: () => setAction(item.label),
        }))}
      />
      <p role="status">Last action: {action}</p>
    </>
  );
}
export const ActionFeedback: Story = { render: () => <ActionsExample /> };
