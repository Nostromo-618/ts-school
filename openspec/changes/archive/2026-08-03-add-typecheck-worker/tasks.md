# Tasks

## 1. Standard-library payload

- [x] 1.1 Write `scripts/sync-ts-libs.mjs`: resolve the closure of the entry
      libs (`es2022`, `dom`, `dom.iterable`) by recursing through
      `ts.preProcessFile` reference directives, copy it to `public/ts-lib/`,
      and write `manifest.json` with the compiler version, entry libs, default
      lib, and per-file `{ bytes, integrity }` SHA-384 digests. Prune files the
      closure no longer contains so a downgrade cannot leave orphans. Output is
      timestamp-free and skipped when unchanged, and `--check` reports staleness
      without writing.
- [x] 1.2 Add `sync:ts-libs` to `package.json` plus `predev`, `prebuild` and
      `pretest` hooks, re-reading the file immediately before writing it so the
      sibling change's edits are not clobbered.
- [x] 1.3 Gitignore `public/ts-lib/` and `.harness-dist/`.
- [x] 1.4 Measured: 59 files / 2754 KB total on disk. The `es2022` baseline
      closure that every check loads is **57 files / 459 KB** (81 KB gzipped,
      62 KB brotli); `dom` + `dom.iterable` add **2 files / 2295 KB** (350 KB
      gzipped) and are fetched only when a lesson asks for them.

## 2. Compiler host

- [x] 2.1 Write `src/typecheck/host.ts`: `import type` only, taking the
      TypeScript API as a parameter; `createCompilerOptions()` building the
      fixed baseline from `TypecheckOptions`; `libFileNameFor()` mapping option
      lib names to file names.
- [x] 2.2 Implement the virtual `ts.CompilerHost` over a flat basename-keyed map
      with a shared source-file cache, module and type-reference resolution
      hard-wired to "unresolved", and no path escaping the map — any path
      containing `node_modules` reads as absent, which is what neutralises the
      compiler's `@typescript/lib-*` override probe.
- [x] 2.3 Implement `createTypecheckSession()`: reuses the source-file cache and
      the previous program across checks, collects syntactic then semantic
      diagnostics for `lesson.ts` only, and maps them to `TsDiagnostic`
      (flattened chain, 1-based line/column, span length), sorted by position.
- [x] 2.4 Fail with a clear, named error when a requested lib is not in the
      provided map.

## 3. Worker, lib loading, client, matcher

- [x] 3.1 Write `src/typecheck/libs.ts`: manifest fetch plus lazy per-file fetch
      under `import.meta.env.BASE_URL`, in-memory cache, `crypto.subtle`
      digest verification when available, and a clear error on mismatch.
- [x] 3.2 Write `src/typecheck/worker.ts`: the only value import of
      `typescript`; validates incoming messages (including a 100 000-character
      source cap and a lib-name pattern), serializes and coalesces requests,
      owns one session, and answers every request with either a
      `TypecheckResponse` or a `TypecheckErrorResponse`.
- [x] 3.3 Write `src/typecheck/client.ts`: lazy worker construction guarded on
      `typeof window` / `Worker`, injectable worker factory for tests, 250 ms
      debounce, monotonic request ids with stale-response discard, `cancel()`
      and `terminate()`.
- [x] 3.4 Add `useTypecheck()` to the client module: reactive `diagnostics`,
      `checking`, `error`, `durationMs` and `supported`, source watching, and
      automatic `onMounted` / `onBeforeUnmount` wiring when called inside a
      component.
- [x] 3.5 Write `src/typecheck/match.ts`: `matchesExpected()` returning
      `{ matched, pairs, unmet, unexpected }` with one-actual-per-expectation
      consumption, plus `formatDiagnosticMatch()` for test failure output.
- [x] 3.6 Add `src/typecheck/index.ts` re-exporting the public surface the
      lesson engine consumes.

## 4. Tests

- [x] 4.1 `tests/unit/typecheck-host.spec.ts` — 17 assertions. The round trip
      runs through the generated `public/ts-lib/` payload rather than
      `node_modules`, so it also proves the bytes the browser is served
      actually compile.
- [x] 4.2 `tests/unit/typecheck-match.spec.ts` — 12 assertions across matched,
      unmet, unexpected, substring matching, duplicate-per-line counting and
      the formatter.
- [x] 4.3 `tests/unit/typecheck-client.spec.ts` — 17 assertions against a fake
      worker, covering the debounce, request numbering, stale discard, error
      paths, teardown, the composable's mount/unmount wiring and the
      no-`Worker` path (which is also the server-side shape).
- [x] 4.4 `tests/unit/ts-lib-manifest.spec.ts` — 8 assertions: drift against
      `ts.version`, the 6.0.3 pin itself, per-file digest and byte length,
      transitive closure completeness, dependency ordering, DOM exclusion from
      the baseline, and byte-for-byte reproducibility via `--check`.
- [x] 4.5 `tests/unit/typecheck-libs.spec.ts` — 11 assertions against a fake
      fetch: same-origin URLs under a root and a sub-path base, nothing fetched
      before a check, closure-only fetching, cache hits on the second check,
      an unavailable lib named in the error, and — the security-critical pair —
      a same-length tampered file caught by its SHA-384 digest and a truncated
      one caught by its byte length.
- [x] 4.6 `tests/unit/bundle-isolation.spec.ts` — parses every `src/` module
      with the compiler's own AST and asserts `worker.ts` is the sole value
      import of `typescript`, `host.ts` is type-only, and no `require()` or
      dynamic import reaches it; plus chunk scans of `dist/` and
      `.harness-dist/` when they exist.

## 5. Empirical verification

- [x] 5.1 Build `scripts/harness/` (own `index.html` carrying the application's
      CSP verbatim, `main.ts`, vite config) that mounts the client through
      `useTypecheck()`, and measures latency and payload.
- [x] 5.2 Chunk inspection of `.harness-dist/`: the main chunk is 65.9 KB
      (26.2 KB gzip) and contains **no** compiler fingerprint; the worker chunk
      is 3475 KB (969 KB gzip) and contains all of them. The application build
      (`dist/`) has a single 229 KB app chunk with no compiler in it, because
      no page mounts the client yet.
- [x] 5.3 Ran the harness in Chromium at `http://localhost:8788` under the real
      CSP: typing produced correct diagnostics live (`TS2322` at the right
      1-based positions), console reported **zero** errors and zero CSP
      violations, and the network log showed 57 `/ts-lib/*.d.ts` requests plus
      the manifest — all same-origin, none issued before the first check, and
      `lib.dom.d.ts` never fetched. Latency: **cold 149 ms** round trip (71 ms
      inside the worker), **warm median 1.1 ms** (min 0.7, max 3.7, n=20).
      A Node cross-check of the same session showed 53 ms cold, 1.1 ms warm
      median, and 5.3 ms for a 200-error file.

## 6. Gates

- [x] 6.1 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`,
      `pnpm typecheck` pass. `eslint.config.js` needed two additions: the
      generated `.harness-dist/` and `public/ts-lib/` are ignored, and
      `**/*.ts` is now a linted extension — without it `eslint .` skipped every
      TypeScript file in the repository, so the no-`eval` / no-`Function`
      security rules were never running on the code that compiles learner
      input. All 249 files lint clean.
- [x] 6.2 `pnpm test` passes: 115 assertions across 10 files, 69 of them this
      change's.
- [x] 6.3 `pnpm build` passes and every route still prerenders.
- [x] 6.4 Clean-clone path verified by deleting `public/ts-lib/` and running
      `pnpm build`: the `prebuild` hook regenerated all 60 files and the build
      succeeded, emitting them into `dist/ts-lib/`.
- [x] 6.5 `openspec validate add-typecheck-worker --strict` passes; change
      archived.
