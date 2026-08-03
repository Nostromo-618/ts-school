# Tasks

## 1. Standard-library payload

- [ ] 1.1 Write `scripts/sync-ts-libs.mjs`: resolve the closure of the entry
      libs (`es2022`, `dom`, `dom.iterable`) by recursing through
      `ts.preProcessFile` reference directives, copy it to `public/ts-lib/`,
      and write `manifest.json` with the compiler version, entry libs, default
      lib, and per-file `{ bytes, integrity }` SHA-384 digests. Prune files the
      closure no longer contains so a downgrade cannot leave orphans.
- [ ] 1.2 Add `sync:ts-libs` to `package.json` plus `predev`, `prebuild` and
      `pretest` hooks, re-reading the file immediately before writing it so the
      sibling change's edits are not clobbered.
- [ ] 1.3 Gitignore `public/ts-lib/` and the harness build directory.
- [ ] 1.4 Run the script and record the emitted file count and byte size for
      the baseline closure and for the DOM addition.

## 2. Compiler host

- [ ] 2.1 Write `src/typecheck/host.ts`: `import type` only, taking the
      TypeScript API as a parameter; `createCompilerOptions()` building the
      fixed baseline from `TypecheckOptions`; `libFileNamesFor()` mapping option
      lib names to file names.
- [ ] 2.2 Implement the virtual `ts.CompilerHost` over a flat basename-keyed map
      with a shared source-file cache, module and type-reference resolution
      hard-wired to "unresolved", and no path escaping the map.
- [ ] 2.3 Implement `createTypecheckSession()`: reuses the source-file cache and
      the previous program across checks, collects syntactic then semantic
      diagnostics for `lesson.ts` only, and maps them to `TsDiagnostic`
      (flattened chain, 1-based line/column, span length), sorted by position.
- [ ] 2.4 Fail with a clear, named error when a requested lib is not in the
      provided map.

## 3. Worker, lib loading, client, matcher

- [ ] 3.1 Write `src/typecheck/libs.ts`: manifest fetch plus lazy per-file fetch
      under `import.meta.env.BASE_URL`, in-memory cache, `crypto.subtle`
      digest verification when available, and a clear error on mismatch.
- [ ] 3.2 Write `src/typecheck/worker.ts`: the only value import of
      `typescript`; validates incoming messages, serializes and coalesces
      requests, owns one session, and answers every request with either a
      `TypecheckResponse` or a `TypecheckErrorResponse`.
- [ ] 3.3 Write `src/typecheck/client.ts`: lazy worker construction guarded on
      `typeof window` / `Worker`, injectable worker factory for tests, 250 ms
      debounce, monotonic request ids with stale-response discard, `cancel()`
      and `terminate()`.
- [ ] 3.4 Add `useTypecheck()` to the client module: reactive `diagnostics`,
      `checking`, `error`, `durationMs` and `supported`, source watching, and
      automatic `onMounted` / `onBeforeUnmount` wiring when called inside a
      component.
- [ ] 3.5 Write `src/typecheck/match.ts`: `matchesExpected()` returning
      `{ matched, pairs, unmet, unexpected }` with one-actual-per-expectation
      consumption, plus a human-readable formatter for test failure output.
- [ ] 3.6 Add `src/typecheck/index.ts` re-exporting the public surface the
      lesson engine consumes.

## 4. Tests

- [ ] 4.1 `tests/unit/typecheck-host.spec.ts`: real round trip through
      TypeScript 6.0.3 in Node — exact error code and position for a known-bad
      snippet, clean source producing nothing, syntax error surviving, message
      chain flattening, 1-based line/column and span length, strictness toggle,
      DOM lib on and off, unknown lib rejected, and reuse across checks.
- [ ] 4.2 `tests/unit/typecheck-match.spec.ts`: matched, unmet, unexpected,
      substring matching, and duplicate-per-line counting.
- [ ] 4.3 `tests/unit/typecheck-client.spec.ts`: debounce coalescing, stale
      response discard, error propagation, teardown, and the unsupported
      environment path — all against a fake worker.
- [ ] 4.4 `tests/unit/ts-lib-manifest.spec.ts`: manifest exists, its
      `typescriptVersion` equals the installed `typescript` version, every
      manifest file is present on disk with a matching digest and byte length,
      and the closure is complete (no file references a lib outside it).
- [ ] 4.5 `tests/unit/bundle-isolation.spec.ts`: no module under `src/` other
      than the worker imports `typescript` as a value; when `dist/` exists, no
      main-thread chunk contains compiler fingerprints.

## 5. Empirical verification

- [ ] 5.1 Build `scripts/harness/` (own `index.html`, `main.ts`, vite config)
      that mounts the client, types into a textarea, and reports diagnostics
      plus timings.
- [ ] 5.2 Build the harness and inspect the emitted chunks: confirm the
      compiler is in the worker chunk and in no main-thread chunk, and record
      chunk sizes.
- [ ] 5.3 Load the harness in a real browser: confirm a code string in yields
      real diagnostics out, with no CSP violation and no console error, and
      measure cold first-check latency, warm keystroke-to-diagnostic latency,
      and the transferred lib payload.

## 6. Gates

- [ ] 6.1 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`,
      `pnpm typecheck` pass.
- [ ] 6.2 `pnpm test` passes, including the drift and bundle-isolation tests.
- [ ] 6.3 `pnpm build` passes on a fresh payload and the vite-ssg prerender
      stays clean (no route or component is added by this change, so the
      existing prerendered routes must be unchanged).
- [ ] 6.4 Verify a clean-clone path: remove `public/ts-lib/`, run `pnpm build`,
      and confirm the pre-hook regenerates it.
- [ ] 6.5 `openspec validate add-typecheck-worker --strict` passes, then
      archive the change.
