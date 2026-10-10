import type { Meta, StoryObj } from '@storybook/react-vite';
const Foundation = () => (
  <article>
    <h1>Design System</h1>
    <p>
      Five accessible form controls and persistent light/dark/system themes are
      available. Overlay components arrive on day 2.
    </p>
  </article>
);
export default {
  title: 'Introduction/Foundation',
  component: Foundation,
} satisfies Meta<typeof Foundation>;
export const Default: StoryObj<typeof Foundation> = {};
