import esbuild from "esbuild";

esbuild.build({
  allowOverwrite: true,
  bundle: true,
  entryPoints: ["worker/sw.ts"],
  format: "esm",
  minify: true,
  outfile: "../../apps/web/public/sw.js",
  platform: "browser",
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' }
});
