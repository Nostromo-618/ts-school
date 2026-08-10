import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { Plugin } from "vite";

const require = createRequire(import.meta.url);

/** ORT assets Transformers.js loads via env.backends.onnx.wasm.wasmPaths. */
const ORT_WASM_FILES = [
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
] as const;

function resolveTransformersDistDir(): string {
  // Main entry resolves into `dist/` (package.json is not in exports).
  return path.dirname(require.resolve("@huggingface/transformers"));
}

function contentTypeFor(filePath: string): string {
  if (filePath.endsWith(".wasm")) return "application/wasm";
  if (filePath.endsWith(".mjs") || filePath.endsWith(".js")) {
    return "text/javascript; charset=utf-8";
  }
  return "application/octet-stream";
}

/**
 * Serve Transformers.js ORT WASM at `/transformers-wasm/` (dev) and copy into
 * `dist` on build so CSP `script-src 'self'` can load them without jsDelivr.
 */
export function transformersWasmPlugin(): Plugin {
  const distDir = resolveTransformersDistDir();

  return {
    name: "ts-school-transformers-wasm",
    configureServer(server) {
      server.middlewares.use("/transformers-wasm", (req, res, next) => {
        try {
          const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
          const rel = urlPath.replace(/^\/+/, "");
          if (!rel || rel.includes("..")) {
            res.statusCode = 400;
            res.end("Bad path");
            return;
          }
          if (!(ORT_WASM_FILES as readonly string[]).includes(rel)) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }
          const filePath = path.join(distDir, rel);
          if (!filePath.startsWith(distDir)) {
            res.statusCode = 400;
            res.end("Bad path");
            return;
          }
          if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }
          const st = fs.statSync(filePath);
          res.setHeader("Content-Length", String(st.size));
          res.setHeader("Content-Type", contentTypeFor(filePath));
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          if (req.method === "HEAD") {
            res.statusCode = 200;
            res.end();
            return;
          }
          fs.createReadStream(filePath).pipe(res);
        } catch (err) {
          next(err);
        }
      });
    },
    closeBundle() {
      const outDir = path.resolve(process.cwd(), "dist", "transformers-wasm");
      fs.mkdirSync(outDir, { recursive: true });
      for (const name of ORT_WASM_FILES) {
        const src = path.join(distDir, name);
        if (!fs.existsSync(src)) {
          throw new Error(
            `[transformers-wasm] missing ${name} in ${distDir}`,
          );
        }
        fs.copyFileSync(src, path.join(outDir, name));
      }
    },
  };
}
