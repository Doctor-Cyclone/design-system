import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import packageMetadata from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: { __LIBRARY_VERSION__: JSON.stringify(packageMetadata.version) },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
