import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ToastProvider } from './Toast';
import { toast } from './toastStore';
import type { ToastProviderProps } from './Toast.types';
function Example(args: ToastProviderProps) {
  useEffect(() => () => toast.dismiss(), []);
  return (
    <ToastProvider {...args}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button onClick={() => toast.success('Project saved successfully')}>
          Success
        </Button>
        <Button
          variant="danger"
          onClick={() => toast.error('Could not save the project')}
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('A new version is available')}
        >
          Info
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </div>
    </ToastProvider>
  );
}
const meta = {
  title: 'Components/Toast',
  parameters: { docs: { story: { inline: false, height: '400px' } } },
  component: ToastProvider,
  args: { defaultDuration: 5000 },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Persistent: Story = { args: { defaultDuration: 0 } };
export const FastAutoClose: Story = { args: { defaultDuration: 1000 } };
export const DarkTheme: Story = { globals: { theme: 'dark' } };
function MultipleExample() {
  useEffect(() => {
    toast.success('Saved', { duration: 0 });
    toast.info('Invite your team to continue', { duration: 0 });
    toast.error('One attachment could not be uploaded', { duration: 0 });
    return () => toast.dismiss();
  }, []);
  return <ToastProvider />;
}
export const Multiple: Story = { render: () => <MultipleExample /> };
function LongExample() {
  useEffect(() => {
    toast.info(
      'Your project has been saved. This deliberately long notification verifies wrapping and leaves enough space for the dismiss button even on narrow screens.',
      { duration: 0 },
    );
    return () => toast.dismiss();
  }, []);
  return <ToastProvider />;
}
export const LongText: Story = { render: () => <LongExample /> };
