#!/usr/bin/env node
/**
 * Soft check for local Gemma mirrors. Never fails — only prints guidance.
 * Prefer `pnpm models:fetch -- --from-labs` when labs already has weights.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelsDir = path.join(root, ".models");
const defaultId = "gemma-4-E2B-it-web";
const modelFile = path.join(
  modelsDir,
  defaultId,
  "gemma-4-E2B-it-web.litertlm",
);

if (fs.existsSync(modelFile)) {
  const size = fs.statSync(modelFile).size;
  console.log(
    `[models] local cache ready: /models/${defaultId}/ (${(size / 1e9).toFixed(2)} GB)`,
  );
} else {
  console.log(
    `[models] no local Gemma mirror yet. Chat Load will hit Hugging Face unless you run:`,
  );
  console.log(`  pnpm models:fetch -- --from-labs`);
  console.log(`  # or: pnpm models:fetch`);
}
