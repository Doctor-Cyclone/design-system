import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import type { ModalProps } from './Modal.types';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
function Example(args: ModalProps) {
  const [open, setOpen] = useState(args.open);
  const first = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        initialFocusRef={first}
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Input ref={first} label="Project name" placeholder="My project" />
          {args.children}
          <Button onClick={() => setOpen(false)}>Save and close</Button>
        </div>
      </Modal>
    </>
  );
}
const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    open: false,
    title: 'Create project',
    description: 'Choose a name for your new project.',
    onClose: () => {},
    children: <p>Your changes stay local until you save.</p>,
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
export const LongContent: Story = {
  args: {
    open: true,
    children: (
      <>
        {Array.from({ length: 20 }, (_, index) => (
          <p key={index}>
            Section {index + 1}: Review this setting before saving the project.
          </p>
        ))}
      </>
    ),
  },
};
export const OverlayDismissDisabled: Story = {
  args: { closeOnOverlay: false },
};
export const DarkTheme: Story = {
  args: { open: true },
  globals: { theme: 'dark' },
};
export const SelectInside: Story = {
  args: {
    children: (
      <Select
        label="Visibility"
        options={[
          { value: 'private', label: 'Private' },
          { value: 'public', label: 'Public' },
        ]}
      />
    ),
  },
};
function NestedExample() {
  const [outer, setOuter] = useState(false);
  const [inner, setInner] = useState(false);
  return (
    <>
      <Button onClick={() => setOuter(true)}>Open parent</Button>
      <Modal open={outer} onClose={() => setOuter(false)} title="Parent dialog">
        <Button onClick={() => setInner(true)}>Open confirmation</Button>
        <Modal
          open={inner}
          onClose={() => setInner(false)}
          title="Confirm changes"
        >
          <Button onClick={() => setInner(false)}>Confirm</Button>
        </Modal>
      </Modal>
    </>
  );
}
export const Nested: Story = { render: () => <NestedExample /> };
