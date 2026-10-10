import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: { a11y: { test: 'error' }, controls: { expanded: true } },
  tags: ['autodocs'],
};
export default preview;
