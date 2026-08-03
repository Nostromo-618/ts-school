import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

/**
 * A standalone entry that mounts the type-check client outside the
 * application's route graph.
 *
 * `add-typecheck-worker` ships no component, and `src/pages/` belongs to
 * another change, so without this nothing in the app imports the client — which
 * would make "the compiler is absent from the main bundle" a claim about an
 * empty graph. Building this harness produces a real main chunk that imports
 * the client and a real worker chunk that imports the compiler, so the claim
 * can be checked. It is also where round-trip latency is measured in a browser.
 *
 *   pnpm run harness:dev      # http://localhost:5173
 *   pnpm run harness:build    # -> .harness-dist/
 *   pnpm run harness:preview  # http://localhost:8788
 *
 * `public/ts-lib/` must exist first (`pnpm run sync:ts-libs`).
 */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  publicDir: fileURLToPath(new URL("../../public", import.meta.url)),
  base: process.env.VITE_BASE ?? "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../../src", import.meta.url)),
    },
    dedupe: ["vue"],
  },
  // Mirrors the application build, because that is what is being verified.
  worker: { format: "es" },
  build: {
    target: "es2022",
    outDir: fileURLToPath(new URL("../../.harness-dist", import.meta.url)),
    emptyOutDir: true,
  },
});
