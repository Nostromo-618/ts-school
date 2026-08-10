import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import * as ts from "typescript-strada";
import { describe, expect, it } from "vitest";

/**
 * The Strada Compiler API must never reach the browser bundle. Diagnostic
 * generation and compiler-truth run in Node only.
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

function scriptOf(path: string): string {
  const text = readFileSync(path, "utf8");
  if (!path.endsWith(".vue")) return text;
  return [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .join("\n");
}

interface ModuleImport {
  file: string;
  module: string;
  typeOnly: boolean;
}

function moduleImports(
  path: string,
  modules: string[],
): ModuleImport[] {
  const source = ts.createSourceFile(
    path,
    scriptOf(path),
    ts.ScriptTarget.ESNext,
    true,
  );
  const file = relative(repoRoot, path);
  const found: ModuleImport[] = [];

  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      continue;
    }
    const module = statement.moduleSpecifier.text;
    if (!modules.includes(module)) continue;
    found.push({
      file,
      module,
      typeOnly: statement.importClause?.isTypeOnly === true,
    });
  }
  return found;
}

const compilerModules = ["typescript", "typescript-strada"];
const imports = sourceFiles(srcDir).flatMap((path) =>
  moduleImports(path, compilerModules),
);

describe("compiler API stays out of the browser source tree", () => {
  it("never value-imports typescript or typescript-strada under src/", () => {
    const valueImports = imports
      .filter((entry) => !entry.typeOnly)
      .map((entry) => `${entry.file} → ${entry.module}`);

    expect(valueImports).toEqual([]);
  });

  it("allows type-only host imports of typescript-strada", () => {
    expect(imports).toContainEqual({
      file: "src/typecheck/host.ts",
      module: "typescript-strada",
      typeOnly: true,
    });
  });

  it("never reaches the compiler through require or a dynamic import", () => {
    const offenders = sourceFiles(srcDir).filter((path) =>
      /(require\(|import\()\s*["']typescript(-strada)?["']/.test(scriptOf(path)),
    );

    expect(offenders).toEqual([]);
  });
});

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
    hasCompiler: (() => {
      const text = readFileSync(resolve(assets, name), "utf8");
      return COMPILER_FINGERPRINTS.every((mark) => text.includes(mark));
    })(),
  }));
}

const appChunks = chunkScan(resolve(repoRoot, "dist"));

describe.skipIf(!appChunks)("the built site", () => {
  it("ships no chunk containing the compiler", () => {
    const leaked = appChunks
      ?.filter((chunk) => chunk.hasCompiler)
      .map((chunk) => chunk.name);

    expect(leaked).toEqual([]);
  });
});
