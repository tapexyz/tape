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
    }
  };
});
