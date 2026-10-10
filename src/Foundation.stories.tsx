import type { Meta, StoryObj } from '@storybook/react-vite';
const Foundation = () => (
  <article>
    <h1>Design System</h1>
    <p>
      React 19 component library. Components and themes are arriving in the next
      milestone.
    </p>
  </article>
);
export default {
  title: 'Introduction/Foundation',
  component: Foundation,
} satisfies Meta<typeof Foundation>;
export const Default: StoryObj<typeof Foundation> = {};
