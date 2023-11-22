/**
 * To configure the vite development proxy server, ensure this file is at
 * ./dev-proxy/proxy-table.ts and conforms to the syntax described here:
 * https://vitejs.dev/config/server-options.html#server-proxy
 *
 * The hostnames that follow are docker service names, and so to resolve to
 * containers. If using this setup, the vite server must belong to the docker
 * network containing the backend services (see ./README.md).
 */

export const devProxy = {
  '/vector': {
    target: 'http://vector-tileserver:8080',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/vector/, ''),
  },
  '/api': {
    target: 'http://backend:8888',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  '/extract': {
    target: 'http:/irv-autopkg-api:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/extract/, ''),
  },
};
