import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // Output to the static directory instead of assets
        // FMI: https://stackoverflow.com/a/72024201
        assetFileNames: (assetInfo) => {
          // Rolldown may pass undefined name for internally generated CSS assets
          const name = assetInfo.name ?? (assetInfo.names && assetInfo.names[0]) ?? '';
          const info = name.split('.');
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
  lint: {
    rules: {
      'no-unused-vars': 'off',
    },
    plugins: ['react', 'jest', 'typescript'],
    env: {
      browser: true,
    },
  },
  fmt: {
    printWidth: 110,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    semi: true,
    // npm owns package.json formatting; excluding prevents conflicts with npm rewrites in CI
    ignore: ['package.json', 'package-lock.json'],
  },
});
