/**
 * Loads the TypeScript standard-library closure from `typescript-strada`
 * (pinned 6.0.3) for Node-only diagnostic generation and compiler-truth.
 *
 * Discovers closures via `preProcessFile` the same way the old sync-ts-libs
 * script did — never hardcodes the lib graph.
 */

import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript-strada");
const stradaPkg = require.resolve("typescript-strada/package.json");
export const STRADA_LIB_DIR = join(dirname(stradaPkg), "lib");
export const STRADA_VERSION = require("typescript-strada/package.json").version;

const LIB_ALIASES = new Map([
  ["es6", "es2015"],
  ["es7", "es2016"],
]);

export function libFileNameFor(libName) {
  const normalized = libName.toLowerCase().replace(/^lib\.|\.d\.ts$/g, "");
  return `lib.${LIB_ALIASES.get(normalized) ?? normalized}.d.ts`;
}

function closureOf(entryLib, cache) {
  const ordered = [];
  const seen = new Set();

  function visit(libName) {
    const fileName = libFileNameFor(libName);
    if (seen.has(fileName)) return;
    seen.add(fileName);

    const path = join(STRADA_LIB_DIR, fileName);
    const text = readFileSync(path, "utf8");
    const refs = ts
      .preProcessFile(text, false, false)
      .libReferenceDirectives.map((reference) => reference.fileName);

    for (const ref of refs) visit(ref);
    ordered.push(fileName);
  }

  if (!cache.has(entryLib)) {
    visit(entryLib);
    cache.set(entryLib, ordered);
  }
  return cache.get(entryLib);
}

/**
 * @param {string[]} entryLibs
 * @returns {Map<string, string>}
 */
export function loadStradaLibs(entryLibs = ["es2022"]) {
  const cache = new Map();
  const fileNames = new Set(
    entryLibs.flatMap((lib) => closureOf(lib, cache)),
  );
  return new Map(
    [...fileNames].map((fileName) => [
      fileName,
      readFileSync(join(STRADA_LIB_DIR, fileName), "utf8"),
    ]),
  );
}

export { ts as stradaTs };
