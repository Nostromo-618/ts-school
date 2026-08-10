import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import type { Plugin } from "vite";

const require = createRequire(import.meta.url);

function resolveLitertWasmDir(): string {
  const pkgJson = require.resolve("@litert-lm/core/package.json");
  return path.join(path.dirname(pkgJson), "wasm");
}

function contentTypeFor(filePath: string): string {
  if (filePath.endsWith(".wasm")) return "application/wasm";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  return "application/octet-stream";
}

/**
 * Serve `@litert-lm/core/wasm` at `/litert-wasm/` (dev) and copy into `dist`
 * on build so CSP `script-src 'self'` can load the glue without jsDelivr.
 */
export function litertWasmPlugin(): Plugin {
  const wasmDir = resolveLitertWasmDir();

  return {
    name: "ts-school-litert-wasm",
    configureServer(server) {
      server.middlewares.use("/litert-wasm", (req, res, next) => {
        try {
          const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
          const rel = urlPath.replace(/^\/+/, "");
          if (!rel || rel.includes("..")) {
            res.statusCode = 400;
            res.end("Bad path");
            return;
          }
          const filePath = path.join(wasmDir, rel);
          if (!filePath.startsWith(wasmDir)) {
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
      const outDir = path.resolve(process.cwd(), "dist", "litert-wasm");
      fs.mkdirSync(outDir, { recursive: true });
      for (const name of fs.readdirSync(wasmDir)) {
        fs.copyFileSync(path.join(wasmDir, name), path.join(outDir, name));
      }
    },
  };
}
