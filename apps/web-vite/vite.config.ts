import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      !isProd &&
        visualizer({
          filename: "./dist/stats.html",
          open: true
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
      chunkSizeWarningLimit: 3500
      // rollupOptions: {
      //   output: {
      //     manualChunks: (id) => {
      //       if (id.includes("node_modules")) {
      //         if (id.includes("vidstack")) {
      //           return "vidstack";
      //         }
      //         if (id.includes("framer-motion")) {
      //           return "framer-motion";
      //         }
      //         if (id.includes("graphql")) {
      //           return "graphql";
      //         }
      //         if (id.includes("phosphor")) {
      //           return "phosphor";
      //         }
      //         if (id.includes("radix")) {
      //           return "radix";
      //         }
      //         return "vendor";
      //       }
      //     }
      //   }
      // }
    }
  };
});
