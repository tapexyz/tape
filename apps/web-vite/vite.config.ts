import path from "node:path";
import MillionLint from "@million/lint";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import swcReact from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { type PluginOption, defineConfig } from "vite";

const getUniqueChunkName = (facadeModuleId: string) => {
  const modulePathParts = facadeModuleId.split("/");
  const moduleName = modulePathParts[modulePathParts.length - 2] || "module";
  return `assets/${moduleName}-[name].hash-[hash].js`;
};

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      TanStackRouterVite(),
      tailwindcss(),
      swcReact(),
      ...(!isProd
        ? [
            MillionLint.vite(),
            visualizer({
              filename: "./dist/stats.html",
              open: true,
              gzipSize: true,
              brotliSize: true
            }) as PluginOption
          ]
        : [])
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    define: {
      "process.env": process.env
    },
    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            if ("facadeModuleId" in chunkInfo && chunkInfo.facadeModuleId) {
              return getUniqueChunkName(chunkInfo.facadeModuleId);
            }
            return "assets/[name].hash-[hash].js";
          },
          chunkFileNames: (chunkInfo) => {
            if ("facadeModuleId" in chunkInfo && chunkInfo.facadeModuleId) {
              return getUniqueChunkName(chunkInfo.facadeModuleId);
            }
            return "assets/[name].hash-[hash].js";
          },
          assetFileNames: "assets/[name].[hash].[ext]",
          manualChunks: {
            react: ["react"],
            dom: ["react-dom"],
            router: ["@tanstack/react-router"],
            query: ["@tanstack/react-query"],
            motion: ["motion"],
            virtual: ["react-virtuoso"],
            hooks: ["@uidotdev/usehooks"],
            idb: ["idb-keyval"],
            indexer: ["@tape.xyz/indexer"],
            generic: ["@tape.xyz/generic"],
            tw: ["@tape.xyz/winder/src/tw"],
            icons: ["@tape.xyz/winder/src/icons"],
            toast: ["@tape.xyz/winder/src/_components/toast"],
            "video-player": ["@tape.xyz/winder/src/_components/video-player"],
            "audio-player": ["@tape.xyz/winder/src/_components/audio-player"]
          }
        }
      }
    }
  };
});
