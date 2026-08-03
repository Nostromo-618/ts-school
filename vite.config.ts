import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";

const APP_VERSION = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("./package.json", import.meta.url)),
    "utf8",
  ),
).version as string;

export default defineConfig({
  // Base path. Defaults to "/" so local dev, `pnpm run preview`, and the
  // Playwright suites all serve from the root (route paths like `/curriculum`
  // work unchanged). ts-school is local-only, but keeping the env override
  // means a sub-path host needs no code change: set VITE_BASE=/sub-path/.
  // vite-ssg feeds this to the router history base via import.meta.env.BASE_URL,
  // which is also the prefix everything under public/ is served from.
  base: process.env.VITE_BASE ?? "/",
  plugins: [vue()],
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
  worker: {
    // The typecheck worker imports `typescript`, so it has to be an ES module;
    // vite's default worker format is iife, which cannot use `import`. Set here
    // rather than alongside the worker so `new Worker(new URL(…), { type:
    // "module" })` works the day that module is written.
    format: "es",
  },
  ssr: {
    // SSG must transform the packages' .vue components (not require them as
    // CJS) during prerender.
    noExternal: ["@vanduo-oss/vd3", "@vanduo-oss/vd3-cbun"],
  },
  build: {
    // es2022 rather than vd3-docs' es2020: the typecheck worker needs top-level
    // await to lazy-load lib .d.ts files, which es2020 cannot emit.
    target: "es2022",
    cssCodeSplit: true,
  },
});
