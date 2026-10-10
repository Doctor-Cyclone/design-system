import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './Radio';
const meta = {
  title: 'Components/Radio',
  component: Radio,
  args: { label: 'Monthly', name: 'billing', value: 'monthly' },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
function GroupExample() {
  const name = useId();
  const [value, setValue] = useState('monthly');
  return (
    <fieldset>
      <legend>Billing interval</legend>
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        {['monthly', 'yearly'].map((option) => (
          <Radio
            key={option}
            label={option}
            name={name}
            value={option}
            checked={value === option}
            onChange={(event) => setValue(event.target.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}
export const ControlledGroup: Story = { render: () => <GroupExample /> };
export const LongLabel: Story = {
  args: {
    label: 'Annual billing with notifications before the subscription renews',
  },
};
