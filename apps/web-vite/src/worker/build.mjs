import esbuild from "esbuild";

esbuild.build({
  allowOverwrite: true,
  bundle: true,
  entryPoints: ["src/worker/sw.ts"],
  format: "esm",
  minify: true,
  outfile: "dist/sw.js",
  platform: "browser",
  target: "esnext",
  define: { "process.env.NODE_ENV": '"production"' }
});
