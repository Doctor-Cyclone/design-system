import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'svelte', label: 'Svelte' },
];
const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    label: 'Framework',
    options,
    hint: 'Type to filter available frameworks.',
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'react' } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'react' },
};
export const Error: Story = {
  args: { error: 'Choose a framework before continuing.', required: true },
};
export const Empty: Story = { args: { options: [] } };
export const AllDisabled: Story = {
  args: { options: options.map((option) => ({ ...option, disabled: true })) },
};
export const LongOptions: Story = {
  args: {
    options: [
      {
        value: 'long',
        label:
          'A framework with a very long descriptive name that wraps across several lines',
      },
      ...options,
    ],
  },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
function ControlledExample() {
  const [value, setValue] = useState('react');
  return (
    <>
      <Select
        label="Controlled framework"
        options={options}
        value={value}
        onValueChange={setValue}
      />
      <p>Selected value: {value}</p>
    </>
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
