import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Serve `.models/<id>/…` at `/models/<id>/…` (never copied into dist).
 * Supports HEAD probes used by AiChat local-mirror detection.
 * Wired for both `vite` and `vite preview` so gated LLM e2e can use the cache.
 */
export function localModelsPlugin(projectRoot: string): Plugin {
  const localModelsDir = path.join(projectRoot, ".models");

  function mountModels(
    middlewares: {
      use: (
        path: string,
        handler: (
          req: import("http").IncomingMessage,
          res: import("http").ServerResponse,
          next: (err?: unknown) => void,
        ) => void,
      ) => void;
    },
  ): void {
    middlewares.use("/models", (req, res, next) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let rel = urlPath.replace(/^\/+/, "");
        rel = rel.replace(/\/resolve\/main(?=\/|$)/g, "");
        if (!rel || rel.includes("..")) {
          res.statusCode = 400;
          res.end("Bad path");
          return;
        }
        const filePath = path.join(localModelsDir, rel);
        if (!filePath.startsWith(localModelsDir)) {
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
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Accept-Ranges", "bytes");
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
  }

  return {
    name: "ts-school-local-models",
    configureServer(server) {
      mountModels(server.middlewares);
    },
    configurePreviewServer(server) {
      mountModels(server.middlewares);
    },
  };
}
