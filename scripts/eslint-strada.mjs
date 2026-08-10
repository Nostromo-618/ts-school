#!/usr/bin/env node
/**
 * ESLint's @typescript-eslint/parser still needs the Strada Compiler API.
 * Redirect `typescript` → `typescript-strada` the same way vue-tsc-strada does.
 */
import Module from "node:module";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "typescript" || request.startsWith("typescript/")) {
    const redirected =
      request === "typescript"
        ? "typescript-strada"
        : request.replace(/^typescript\//, "typescript-strada/");
    return originalResolve.call(this, redirected, parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

const eslintRoot = dirname(require.resolve("eslint/package.json"));
const eslintBin = join(eslintRoot, "bin", "eslint.js");
process.argv[1] = eslintBin;
await import(pathToFileURL(eslintBin).href);
