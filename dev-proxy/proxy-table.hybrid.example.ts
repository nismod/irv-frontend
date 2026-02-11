/**
 * Hybrid proxy configuration: pixel-driller to localhost, rest to live server
 *
 * To use this, copy it to dev-proxy/proxy-table.ts
 *
 * This configuration:
 * - Routes /api/pixel-driller/* to localhost:8888 (your local backend)
 * - Routes all other /api/* to the live server
 * - Routes /vector and /extract to live server
 *
 * Useful for testing pixel-driller locally while using live tiles/features API
 */

export const devProxy = {
  // Pixel driller goes to local backend (must come before /api)
  '/api/pixel-driller': {
    target: 'http://localhost:8888',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
  // All other API endpoints go to live server
  '/api': {
    target: 'https://global.infrastructureresilience.org:443',
    changeOrigin: true,
  },
  '/vector': {
    target: 'https://global.infrastructureresilience.org:443',
    changeOrigin: true,
  },
  '/extract': {
    target: 'https://global.infrastructureresilience.org:443',
    changeOrigin: true,
  },
};
