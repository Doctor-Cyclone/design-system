import type { Meta, StoryObj } from '@storybook/react-vite';
const Foundation = () => (
  <article>
    <h1>Design System</h1>
    <p>
      Eleven components, persistent light/dark/system themes and documented
      keyboard interactions are available. Chromium checks cover accessibility,
      keyboard behavior and visual regression in both themes.
    </p>
  </article>
);
export default {
  title: 'Introduction/Foundation',
  component: Foundation,
} satisfies Meta<typeof Foundation>;
export const Default: StoryObj<typeof Foundation> = {};
