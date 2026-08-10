#!/usr/bin/env node
/**
 * vue-tsc still needs the Strada (JS) Compiler API. typescript@7 is a native
 * binary without ./lib/tsc exports, so we intercept Node resolution and point
 * every `typescript` import at `typescript-strada` (pinned 6.0.3).
 */
import Module from "node:module";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const stradaEntry = require.resolve("typescript-strada");
const stradaRoot = stradaEntry.replace(/[\\/]lib[\\/]typescript\.js$/, "");

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

const vueTsc = require.resolve("vue-tsc/bin/vue-tsc.js");
process.argv[1] = vueTsc;
await import(pathToFileURL(vueTsc).href);
