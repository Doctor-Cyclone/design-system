import type { StorybookConfig } from '@storybook/react-vite';
import packageMetadata from '../package.json' with { type: 'json' };
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  viteFinal: (config) => ({
    ...config,
    define: {
      ...config.define,
      __LIBRARY_VERSION__: JSON.stringify(packageMetadata.version),
    },
  }),
};
export default config;
