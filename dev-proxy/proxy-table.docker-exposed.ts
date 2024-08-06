/**
 * To configure the vite development proxy server, ensure this file is at
 * ./dev-proxy/proxy-table.ts and conforms to the syntax described here:
 * https://vitejs.dev/config/server-options.html#server-proxy
 *
 * The ports that follow are those exposed by a development docker-compose
 * setup, or could be run locally on the host if preferred (see ./README.md).
 */

export const devProxy = {
  '/vector': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/vector/, ''),
  },
  '/api': {
    target: 'http://localhost:8888',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/extract': {
    target: 'http:/localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/extract/, ''),
  },
};
