import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";
import { localModelsPlugin } from "./vite.local-models.ts";
import { litertWasmPlugin } from "./vite.litert-wasm.ts";
import { transformersWasmPlugin } from "./vite.transformers-wasm.ts";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const APP_VERSION = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./package.json", import.meta.url)),
    "utf8",
  ),
).version as string;

export default defineConfig({
  // Base path. Defaults to "/" so local dev, `pnpm run preview`, and the
  // Playwright suites all serve from the root (route paths like `/curriculum`
  // work unchanged). Project sites on GitHub Pages need a sub-path base, e.g.
  // VITE_BASE=/ts-school/ (set automatically by .github/workflows/pages.yml).
  // vite-ssg feeds this to the router history base via import.meta.env.BASE_URL,
  // which is also the prefix everything under public/ is served from.
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    vue(),
    localModelsPlugin(projectRoot),
    litertWasmPlugin(),
    transformersWasmPlugin(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // One Vue copy for the app and the vd3 packages. Unlike vd3-docs we consume
    // published tarballs rather than `link:` working trees, so pinia dedupes
    // naturally and only vue — which both packages also peer-depend on — needs
    // to be forced.
    dedupe: ["vue"],
  },
  ssr: {
    // SSG must transform the packages' .vue components (not require them as
    // CJS) during prerender.
    noExternal: [
      "@vanduo-oss/vd3",
      "@vanduo-oss/vd3-cbun",
      "@vanduo-oss/vdl-ai-chat",
      "@vanduo-oss/vdl-hybrid-search",
    ],
  },
  optimizeDeps: {
    include: ["@litert-lm/core"],
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
  },
});
