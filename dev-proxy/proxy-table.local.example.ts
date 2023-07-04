/**
 * To configure the vite development proxy server, ensure this file is at
 * ./dev-proxy/proxy-table.ts and conforms to the syntax described here:
 * https://vitejs.dev/config/server-options.html#server-proxy
 */

/*
 * The hostnames that follow are docker service names, and so to resolve to
 * containers, the vite server must belong to the docker network (see README).
 */

export const devProxy = {
  "/vector": {
    target: {
      protocol: "http",
      host: "vector-tileserver",
      port: "8080"
    },
    secure: false,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/vector/, ""),
  },
  "/api": {
    target: {
      protocol: "http",
      host: "backend",
      port: "8888"
    },
    secure: false,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
  "/extract": {
    target: {
      protocol: "http",
      host: "irv-autopkg-api",
      port: "8000"
    },
    secure: false,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/extract/, ""),
  }
};
