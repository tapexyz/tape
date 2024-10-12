import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import biomePlugin from "vite-plugin-biome";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    biomePlugin({
      mode: "check",
      applyFixes: true,
      failOnError: true
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    "process.env": process.env
  }
});
