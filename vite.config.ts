import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import packageMetadata from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: { __LIBRARY_VERSION__: JSON.stringify(packageMetadata.version) },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
  },
});
