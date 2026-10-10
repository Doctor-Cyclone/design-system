import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save changes' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'danger', 'ghost'] as const).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
export const Loading: Story = { args: { loading: true, children: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true } };
export const IconButton: Story = {
  render: () => (
    <Button iconOnly aria-label="Add item">
      <span aria-hidden="true">＋</span>
    </Button>
  ),
};
export const LongText: Story = {
  args: { children: 'Save all changes and notify everyone in the project' },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
