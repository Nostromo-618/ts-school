import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import * as ts from "typescript-strada";

const require = createRequire(import.meta.url);
const stradaPkg = require.resolve("typescript-strada/package.json");
const STRADA_LIB_DIR = join(dirname(stradaPkg), "lib");

const LIB_ALIASES = new Map([
  ["es6", "es2015"],
  ["es7", "es2016"],
]);

function libFileNameFor(libName: string): string {
  const normalized = libName.toLowerCase().replace(/^lib\.|\.d\.ts$/g, "");
  return `lib.${LIB_ALIASES.get(normalized) ?? normalized}.d.ts`;
}

function closureOf(
  entryLib: string,
  cache: Map<string, string[]>,
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  function visit(libName: string): void {
    const fileName = libFileNameFor(libName);
    if (seen.has(fileName)) return;
    seen.add(fileName);
    const text = readFileSync(join(STRADA_LIB_DIR, fileName), "utf8");
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
  return cache.get(entryLib)!;
}

/** Load Strada lib .d.ts files for host unit tests / compiler-truth. */
export function loadStradaLibsForTests(
  entryLibs: string[] = ["es2022"],
): Map<string, string> {
  const cache = new Map<string, string[]>();
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
