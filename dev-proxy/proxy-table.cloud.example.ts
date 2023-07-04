/**
 * To configure the vite development proxy server, ensure this file is at
 * ./dev-proxy/proxy-table.ts and conforms to the syntax described here:
 * https://vitejs.dev/config/server-options.html#server-proxy
 */

export const devProxy = {
  "/vector": {
    target: {
      protocol: "https",
      host: "global.infrastructureresilience.org",
    },
    changeOrigin: true,
  },
  "/api": {
    target: {
      protocol: "https",
      host: "global.infrastructureresilience.org",
    },
    changeOrigin: true,
  },
  "/extract": {
    target: {
      protocol: "https",
      host: "global.infrastructureresilience.org",
    },
    changeOrigin: true,
  }
};
