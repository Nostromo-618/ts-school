#!/usr/bin/env node
/**
 * Copies the TypeScript standard library into `public/ts-lib/` so the
 * in-browser type-check worker can fetch it same-origin, and writes a manifest
 * describing what it copied.
 *
 * The closure is DISCOVERED, never listed: starting from ENTRY_LIBS this walks
 * each file's `/// <reference lib="..." />` directives with the compiler's own
 * preprocessor. A hardcoded list would rot silently the first time TypeScript
 * reshuffles its lib graph, and the whole point of this file is that a compiler
 * upgrade cannot leave the browser checking against a stale standard library.
 *
 * Output is deterministic (no timestamps) and pruned, so re-running it on an
 * unchanged tree produces no diff. It is wired to `predev`, `prebuild` and
 * `pretest`; `public/ts-lib/` is gitignored because every byte of it already
 * exists in `node_modules/typescript/lib`.
 *
 * Usage: node scripts/sync-ts-libs.mjs [--check]
 *   --check  exit non-zero if the output is missing or out of date, write nothing
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { version: typescriptVersion } = require("typescript/package.json");

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const libSourceDir = join(repoRoot, "node_modules", "typescript", "lib");
const outputDir = join(repoRoot, "public", "ts-lib");
const manifestPath = join(outputDir, "manifest.json");

/**
 * Libs the browser checker can be asked for. `es2022` is the fixed baseline
 * (it matches `build.target`); the DOM pair is opt-in per lesson through
 * `TypecheckOptions.libs` and costs 2.1 MB, so it is fetched only on request.
 */
const ENTRY_LIBS = ["es2022", "dom", "dom.iterable"];
const DEFAULT_LIB = "es2022";

/** SRI-style digest, the same shape a `<link integrity>` attribute carries. */
function integrityOf(bytes) {
  return `sha384-${createHash("sha384").update(bytes).digest("base64")}`;
}

/**
 * `--lib es2015` and `--lib dom.iterable` name files, with a couple of
 * historical aliases. TypeScript's own `libMap` is not part of its public API,
 * so this mirrors it for the names ts-school can actually request. Kept in
 * sync with `libFileNameFor()` in `src/typecheck/host.ts`.
 */
const LIB_ALIASES = new Map([
  ["es6", "es2015"],
  ["es7", "es2016"],
]);

function libFileNameFor(libName) {
  const normalized = libName.toLowerCase().replace(/^lib\.|\.d\.ts$/g, "");
  return `lib.${LIB_ALIASES.get(normalized) ?? normalized}.d.ts`;
}

/**
 * Transitive closure of a lib file's `/// <reference lib="..." />` directives,
 * dependencies first.
 */
function closureOf(entryLib, cache) {
  const ordered = [];
  const seen = new Set();

  const visit = (libName) => {
    const fileName = libFileNameFor(libName);
    if (seen.has(fileName)) return;
    seen.add(fileName);

    const path = join(libSourceDir, fileName);
    if (!existsSync(path)) {
      throw new Error(
        `typescript@${typescriptVersion} ships no ${fileName} (referenced while resolving lib "${entryLib}")`,
      );
    }
    const bytes = readFileSync(path);
    cache.set(fileName, bytes);

    for (const reference of ts.preProcessFile(bytes.toString("utf8"), false, false)
      .libReferenceDirectives) {
      visit(reference.fileName);
    }
    ordered.push(fileName);
  };

  visit(entryLib);
  return ordered;
}

function buildPayload() {
  const contents = new Map();
  /** @type {Record<string, string[]>} */
  const closures = {};

  for (const entryLib of ENTRY_LIBS) {
    closures[entryLib] = closureOf(entryLib, contents);
  }

  const files = {};
  for (const fileName of [...contents.keys()].sort()) {
    const bytes = contents.get(fileName);
    files[fileName] = { bytes: bytes.byteLength, integrity: integrityOf(bytes) };
  }

  return {
    contents,
    manifest: {
      typescriptVersion,
      defaultLib: libFileNameFor(DEFAULT_LIB),
      entryLibs: ENTRY_LIBS,
      closures,
      files,
    },
  };
}

function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function isUpToDate({ contents, manifest }) {
  if (!existsSync(manifestPath)) return false;
  if (readFileSync(manifestPath, "utf8") !== serializeManifest(manifest)) {
    return false;
  }
  for (const [fileName, bytes] of contents) {
    const path = join(outputDir, fileName);
    if (!existsSync(path) || !readFileSync(path).equals(bytes)) return false;
  }
  return true;
}

function write({ contents, manifest }) {
  mkdirSync(outputDir, { recursive: true });

  // Prune first: a downgrade can shrink the closure, and an orphaned lib file
  // that no manifest vouches for should not stay in the served payload.
  const expected = new Set([...contents.keys(), "manifest.json"]);
  for (const entry of readdirSync(outputDir)) {
    if (!expected.has(entry)) rmSync(join(outputDir, entry), { recursive: true });
  }

  for (const [fileName, bytes] of contents) {
    writeFileSync(join(outputDir, fileName), bytes);
  }
  writeFileSync(manifestPath, serializeManifest(manifest));
}

function main() {
  const checkOnly = process.argv.includes("--check");
  const payload = buildPayload();
  const upToDate = isUpToDate(payload);

  if (checkOnly) {
    if (!upToDate) {
      process.stderr.write(
        "public/ts-lib/ is missing or stale — run `pnpm run sync:ts-libs`\n",
      );
      process.exitCode = 1;
    }
    return;
  }

  if (!upToDate) write(payload);

  const totalBytes = [...payload.contents.values()].reduce(
    (sum, bytes) => sum + bytes.byteLength,
    0,
  );
  process.stdout.write(
    `ts-lib: ${payload.contents.size} files, ${(totalBytes / 1024).toFixed(0)} KB ` +
      `from typescript@${payload.manifest.typescriptVersion}` +
      `${upToDate ? " (already up to date)" : ""}\n`,
  );
}

main();
