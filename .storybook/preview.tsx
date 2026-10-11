import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Component theme',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme}
        style={{
          padding: 'var(--space-6)',
          background: 'var(--color-bg)',
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)',
          minHeight: '200px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  // Scan the document, including portal-mounted dialogs outside the story root.
  parameters: {
    a11y: { test: 'error', context: 'body' },
    controls: { expanded: true },
  },
  tags: ['autodocs'],
};
export default preview;
