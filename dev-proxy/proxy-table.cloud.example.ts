/**
 * To configure the vite development proxy server, ensure this file is at
 * ./dev-proxy/proxy-table.ts and conforms to the syntax described here:
 * https://vitejs.dev/config/server-options.html#server-proxy
 */

export const devProxy = {
  "/vector": {
    target: "https://global.infrastructureresilience.org:443",
    changeOrigin: true,
  },
  "/api": {
    target: "https://global.infrastructureresilience.org:443",
    changeOrigin: true,
  },
  "/extract": {
    target: "https://global.infrastructureresilience.org:443",
    changeOrigin: true,
  }
};
