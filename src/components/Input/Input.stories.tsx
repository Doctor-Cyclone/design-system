import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
const meta = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'you@example.com', type: 'email' },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Hint: Story = {
  args: { hint: 'We only use this to contact you about your account.' },
};
export const Error: Story = {
  args: {
    error: 'Enter a valid email address.',
    defaultValue: 'not-an-email',
    hint: 'Use your work email.',
  },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'read-only@example.com' },
};
export const Required: Story = { args: { required: true } };
export const Adornments: Story = {
  args: {
    label: 'Website',
    type: 'text',
    prefix: 'https://',
    suffix: '.com',
    placeholder: 'example',
  },
};
export const LongLabel: Story = {
  args: {
    label:
      'Email address used for all project notifications and billing communications',
  },
};
function ControlledExample() {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Controlled input"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      hint={`Characters: ${value.length}`}
    />
  );
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
