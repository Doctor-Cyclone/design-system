import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { content: 'Save your changes', children: <Button>Save</Button> },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Immediate: Story = { args: { delay: 0 } };
export const Delayed: Story = { args: { delay: 1000 } };
export const IconButton: Story = {
  args: {
    content: 'More information about this setting',
    children: (
      <Button iconOnly aria-label="Help" variant="secondary">
        ?
      </Button>
    ),
  },
};
export const LongText: Story = {
  args: {
    content:
      'This action saves all changes in the current project. You can continue editing afterward.',
  },
};
export const DarkTheme: Story = { globals: { theme: 'dark' } };
