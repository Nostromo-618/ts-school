#!/usr/bin/env node
/**
 * Prefetch Gemma LiteRT weights into `.models/` for local Vite serving.
 *
 * Served in `pnpm dev` at `/models/<id>/` (never shipped in `dist/`).
 *
 * Usage:
 *   pnpm models:fetch
 *   pnpm models:fetch -- --model gemma-4-E4B-it-web
 *   pnpm models:fetch -- --all
 *   pnpm models:fetch -- --dry-run
 *   pnpm models:fetch -- --force
 *   pnpm models:fetch -- --from-labs   # hardlink/copy from ../0_vanduo/labs/.models when present
 */

import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELS_DIR = path.join(ROOT, ".models");
const LABS_MODELS = path.resolve(ROOT, "../0_vanduo/labs/.models");

const CATALOG = {
  "gemma-4-E2B-it-web": {
    kind: "files",
    hfRepo: "litert-community/gemma-4-E2B-it-litert-lm",
    approxBytes: 2.0e9,
    files: [
      {
        path: "gemma-4-E2B-it-web.litertlm",
        outName: "gemma-4-E2B-it-web.litertlm",
      },
    ],
  },
  "gemma-4-E4B-it-web": {
    kind: "files",
    hfRepo: "litert-community/gemma-4-E4B-it-litert-lm",
    approxBytes: 2.5e9,
    files: [
      {
        path: "gemma-4-E4B-it-web.litertlm",
        outName: "gemma-4-E4B-it-web.litertlm",
      },
    ],
  },
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const fromLabs = args.includes("--from-labs");
const all = args.includes("--all");
const modelFlagIdx = args.indexOf("--model");
const modelIds = all
  ? Object.keys(CATALOG)
  : [modelFlagIdx >= 0 ? args[modelFlagIdx + 1] : "gemma-4-E2B-it-web"];

function formatBytes(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function listAllFiles(hfRepo, apiUrl) {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HF tree failed (${res.status}): ${apiUrl}`);
  const items = await res.json();
  const files = [];
  for (const item of items) {
    if (item.type === "directory") {
      const nested = await listAllFiles(
        hfRepo,
        `https://huggingface.co/api/models/${hfRepo}/tree/main/${item.path}`,
      );
      files.push(...nested);
    } else if (item.type === "file") {
      files.push({
        path: item.path,
        size: item.lfs?.size || item.size || 0,
      });
    }
  }
  return files;
}

function tryImportFromLabs(modelId, outDir) {
  const srcDir = path.join(LABS_MODELS, modelId);
  if (!fs.existsSync(srcDir)) return false;
  if (dryRun) {
    console.log(`[models:fetch] would import from labs: ${srcDir}`);
    return true;
  }
  fs.mkdirSync(outDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    if (name.startsWith(".")) continue;
    const src = path.join(srcDir, name);
    const dest = path.join(outDir, name);
    if (!force && fs.existsSync(dest)) {
      const a = fs.statSync(src);
      const b = fs.statSync(dest);
      if (a.size === b.size) {
        console.log(`  ${name} … ok (cached)`);
        continue;
      }
    }
    try {
      fs.copyFileSync(src, dest);
      console.log(`  ${name} … ok (from labs)`);
    } catch (err) {
      console.warn(`  ${name} … labs copy failed (${err.message}), will download`);
      return false;
    }
  }
  fs.writeFileSync(
    path.join(outDir, ".ts-school-model.json"),
    `${JSON.stringify(
      {
        modelId,
        source: "labs",
        labsPath: srcDir,
        fetchedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
  return true;
}

async function downloadFile(hfRepo, relPath, dest, expectedSize) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (!force && fs.existsSync(dest)) {
    const st = fs.statSync(dest);
    if (expectedSize > 0 && st.size === expectedSize) {
      return { skipped: true, bytes: st.size };
    }
    if (expectedSize <= 0 && st.size > 0) {
      return { skipped: true, bytes: st.size };
    }
  }

  if (dryRun) {
    return { skipped: false, bytes: expectedSize, dryRun: true };
  }

  const url = `https://huggingface.co/${hfRepo}/resolve/main/${relPath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  if (!res.body) throw new Error(`Empty body: ${url}`);

  const tmp = `${dest}.partial`;
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
  const st = fs.statSync(tmp);
  if (expectedSize > 0 && st.size !== expectedSize) {
    fs.unlinkSync(tmp);
    throw new Error(
      `Size mismatch for ${relPath}: got ${st.size}, expected ${expectedSize}`,
    );
  }
  fs.renameSync(tmp, dest);
  return { skipped: false, bytes: st.size };
}

async function fetchModel(modelId) {
  const entry = CATALOG[modelId];
  if (!entry) {
    console.error(
      `Unknown model "${modelId}". Known: ${Object.keys(CATALOG).join(", ")}`,
    );
    process.exit(1);
  }

  const outDir = path.join(MODELS_DIR, modelId);
  console.log(`[models:fetch] model=${modelId}`);
  console.log(
    `[models:fetch] repo=https://huggingface.co/${entry.hfRepo}`,
  );
  console.log(
    `[models:fetch] out=${path.relative(ROOT, outDir)} (~${formatBytes(entry.approxBytes)})`,
  );

  if (fromLabs || fs.existsSync(path.join(LABS_MODELS, modelId))) {
    console.log(`[models:fetch] checking labs mirror at ${LABS_MODELS}`);
    if (tryImportFromLabs(modelId, outDir)) {
      console.log(`[models:fetch] done — local cache ready at /models/${modelId}/`);
      return;
    }
  }

  const tree = await listAllFiles(
    entry.hfRepo,
    `https://huggingface.co/api/models/${entry.hfRepo}/tree/main`,
  );
  const byPath = new Map(tree.map((f) => [f.path, f]));
  const files = entry.files.map((f) => {
    const meta = byPath.get(f.path);
    return {
      path: f.path,
      outName: f.outName || f.path,
      size: meta?.size || 0,
    };
  });

  fs.mkdirSync(outDir, { recursive: true });
  let downloaded = 0;
  let skipped = 0;
  let bytes = 0;

  for (const file of files) {
    process.stdout.write(`  ${file.path} (${formatBytes(file.size)}) … `);
    const result = await downloadFile(
      entry.hfRepo,
      file.path,
      path.join(outDir, file.outName),
      file.size,
    );
    if (result.dryRun) {
      console.log("would fetch");
    } else if (result.skipped) {
      skipped += 1;
      bytes += result.bytes;
      console.log("ok (cached)");
    } else {
      downloaded += 1;
      bytes += result.bytes;
      console.log("ok");
    }
  }

  if (!dryRun) {
    fs.writeFileSync(
      path.join(outDir, ".ts-school-model.json"),
      `${JSON.stringify(
        {
          modelId,
          hfRepo: entry.hfRepo,
          fetchedAt: new Date().toISOString(),
          fileCount: files.length,
          bytes,
        },
        null,
        2,
      )}\n`,
    );
  }

  console.log(
    `[models:fetch] done — downloaded ${downloaded}, reused ${skipped}. Serve with pnpm dev → /models/${modelId}/`,
  );
}

async function main() {
  if (dryRun) console.log("[models:fetch] dry-run — no files written");
  for (const id of modelIds) {
    await fetchModel(id);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
