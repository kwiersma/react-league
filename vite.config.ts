import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Output to the static directory instead of assets
        // FMI: https://stackoverflow.com/a/72024201
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2/.test(extType)) {
            extType = 'css';
          }
          return `static/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // react-data-table-component has an empty "exports": {} in package.json which blocks
      // Vite 8/Rolldown from using the ESM "module" field. The CJS wrapper produces
      // `export default require_index_cjs()` which returns the whole exports object rather than
      // the component, breaking the default import. Alias directly to the ESM bundle.
      'react-data-table-component': path.resolve(
        'node_modules/react-data-table-component/dist/index.es.js'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  server: {
    proxy: {
      '/api2': {
        target: 'http://127.0.0.1:8000/api2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, ''),
      },
    },
  },
});
