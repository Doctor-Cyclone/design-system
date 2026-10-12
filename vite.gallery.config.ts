import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import packageMetadata from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: { __LIBRARY_VERSION__: JSON.stringify(packageMetadata.version) },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: { outDir: 'gallery-dist' },
});
