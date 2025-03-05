/// <reference types="vitest" />

import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

/**
 * To set up a development proxy, create and edit the file dev-proxy/proxy-table.ts
 * You can copy and rename one of the included examples.
 * See https://vitejs.dev/config/server-options.html#server-proxy for syntax
 */
const proxyTable = await import('./dev-proxy/proxy-table').catch((err) => {
  console.error(err);
  console.log('Fallback to empty proxy table');
  return { devProxy: {} };
});
const devProxy = proxyTable.devProxy;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({}),
    },
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    qrcode({
      filter: (url) => url.startsWith('http://192'),
    }),
    visualizer({
      template: 'treemap', // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'bundle-analyse.html',
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: devProxy,
    host: '0.0.0.0', // listen on all network interfaces
  },
  test: {},
});
