import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

describe("transformers ORT wasm assets", () => {
  it("ships the jsep ORT files Transformers.js requests", () => {
    const distDir = path.dirname(require.resolve("@huggingface/transformers"));
    for (const name of [
      "ort-wasm-simd-threaded.jsep.mjs",
      "ort-wasm-simd-threaded.jsep.wasm",
    ]) {
      expect(fs.existsSync(path.join(distDir, name)), name).toBe(true);
    }
  });
});
