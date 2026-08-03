import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * The compiler must never reach the main thread. 8.7 MB of parser, binder and
 * checker in the main bundle would wreck the site's load, and the reason the
 * worker boundary exists at all is that learner source is compiled but never
 * executed — a boundary that only holds if nothing else pulls `typescript` in.
 *
 * The source-graph assertion is the real guard: it needs no build and cannot
 * be skipped. The chunk scans below confirm the built output agrees.
 */

const repoRoot = process.cwd();
const srcDir = resolve(repoRoot, "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|mts|vue)$/.test(entry.name) ? [path] : [];
  });
}

/** The `<script>` body of an SFC, or the whole file for a plain module. */
function scriptOf(path: string): string {
  const text = readFileSync(path, "utf8");
  if (!path.endsWith(".vue")) return text;
  return [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .join("\n");
}

interface TypescriptImport {
  file: string;
  typeOnly: boolean;
}

function typescriptImports(path: string): TypescriptImport[] {
  const source = ts.createSourceFile(
    path,
    scriptOf(path),
    ts.ScriptTarget.ESNext,
    true,
  );
  const file = relative(repoRoot, path);
  const found: TypescriptImport[] = [];

  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== "typescript"
    ) {
      continue;
    }
    found.push({ file, typeOnly: statement.importClause?.isTypeOnly === true });
  }
  return found;
}

const imports = sourceFiles(srcDir).flatMap(typescriptImports);

describe("typescript stays behind the worker boundary", () => {
  it("is imported as a value by the worker and nothing else", () => {
    const valueImports = imports
      .filter((entry) => !entry.typeOnly)
      .map((entry) => entry.file);

    expect(valueImports).toEqual(["src/typecheck/worker.ts"]);
  });

  it("is imported as a type by the compiler host, so the import erases", () => {
    expect(imports).toContainEqual({
      file: "src/typecheck/host.ts",
      typeOnly: true,
    });
  });

  it("is never reached through require or a dynamic import", () => {
    const offenders = sourceFiles(srcDir).filter((path) =>
      /(require\(|import\()\s*["']typescript["']/.test(scriptOf(path)),
    );

    expect(offenders).toEqual([]);
  });
});

/**
 * Fingerprints of the compiler's own source. `createProgram` alone would be
 * ambiguous, so these are strings only the real thing carries.
 */
const COMPILER_FINGERPRINTS = [
  "getSemanticDiagnostics",
  "createTypeChecker",
  "versionMajorMinor",
];

function chunkScan(distDir: string) {
  const assets = resolve(distDir, "assets");
  if (!existsSync(assets)) return undefined;

  const chunks = readdirSync(assets).filter((name) => name.endsWith(".js"));
  return chunks.map((name) => ({
    name,
    isWorker: name.includes("worker"),
    hasCompiler: (() => {
      const text = readFileSync(resolve(assets, name), "utf8");
      return COMPILER_FINGERPRINTS.every((mark) => text.includes(mark));
    })(),
  }));
}

const appChunks = chunkScan(resolve(repoRoot, "dist"));
const harnessChunks = chunkScan(resolve(repoRoot, ".harness-dist"));

describe.skipIf(!appChunks)("the built site", () => {
  it("ships no chunk containing the compiler", () => {
    // Nothing in the app imports the client yet — no lesson page exists — so
    // there should be no worker chunk either. The moment one appears, the
    // assertion below still holds for every main-thread chunk.
    const leaked = appChunks
      ?.filter((chunk) => chunk.hasCompiler && !chunk.isWorker)
      .map((chunk) => chunk.name);

    expect(leaked).toEqual([]);
  });
});

describe.skipIf(!harnessChunks)("the harness build", () => {
  it("keeps the compiler in the worker chunk and out of every other one", () => {
    const withCompiler = harnessChunks?.filter((chunk) => chunk.hasCompiler);

    // Proves the scan can actually see a compiler when one is present, which
    // is what makes the negative assertion above worth anything.
    expect(withCompiler?.length).toBeGreaterThan(0);
    expect(withCompiler?.every((chunk) => chunk.isWorker)).toBe(true);
  });
});
