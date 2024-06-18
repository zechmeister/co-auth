import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: "dist/index.js",
  treeShaking: true,
  define: { "import.meta.vitest": "undefined" },
});
