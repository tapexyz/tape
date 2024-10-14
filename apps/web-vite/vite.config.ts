import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import swcReact from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      TanStackRouterVite(),
      swcReact(),
      !isProd &&
        visualizer({
          filename: "./dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true
        })
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    define: {
      "process.env": process.env
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react"],
            dom: ["react-dom"],
            router: ["@tanstack/react-router"],
            query: ["@tanstack/react-query"],
            framer: ["framer-motion"],
            virtual: ["react-virtuoso"],
            hooks: ["@uidotdev/usehooks"],
            lens: ["@tape.xyz/lens"],
            generic: ["@tape.xyz/generic"]
          }
        }
      }
    }
  };
});
