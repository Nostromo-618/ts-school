## Why

Every ts-school lesson claims "TypeScript catches this". The claim is only
honest if a real compiler answers the learner in the browser, so the TS pane
needs `tsc` behind it — not a tokenizer, not a heuristic. `VdCodeEditor` is a
textarea-overlay editor with homegrown highlighting and no language service, so
nothing in the stack provides diagnostics today.

Running a compiler over learner-authored text is also the project's largest
security surface, and it has to be closed by construction rather than by
convention: the compiler is loaded only inside a Web Worker, the standard
library is served same-origin from our own build output, and the learner's code
is parsed and type-checked but never executed.

## What Changes

- Add `src/typecheck/host.ts`: a first-party virtual `ts.CompilerHost` over an
  in-memory file map (one `lesson.ts` plus the `lib.*.d.ts` closure). It takes
  the TypeScript API as a parameter and imports it `import type` only, so the
  module is provably compiler-free in the bundle graph and unit-testable in
  plain Node.
- Add `src/typecheck/worker.ts`: an ES-module Web Worker — the only module in
  the repository that imports `typescript` as a value. It owns a long-lived
  session so the ~460 KB lib closure is parsed once rather than per keystroke,
  maps `ts.Diagnostic[]` onto the shared `TsDiagnostic` contract, and answers
  malformed input or an internal fault with a `TypecheckErrorResponse` instead
  of dying.
- Add `src/typecheck/libs.ts`: lazy, cached, same-origin lib loading under
  `import.meta.env.BASE_URL`, with SubtleCrypto verification of each file
  against the manifest's recorded digest where the platform provides it.
- Add `src/typecheck/client.ts`: the main-thread client — lazily constructed,
  never during SSR, debounced at 250 ms, correlating responses by a monotonic
  `requestId` and discarding stale ones — plus a `useTypecheck()` Vue composable
  returning reactive diagnostics and a checking flag for the lesson engine to
  bind directly.
- Add `src/typecheck/match.ts`: `matchesExpected()`, the structured comparison
  of actual diagnostics against a lesson's authored `ExpectedDiagnostic[]`,
  reporting matched, unmet, and unexpected entries so a failing lesson prints a
  useful message.
- Add `scripts/sync-ts-libs.mjs`: resolves the lib closure by following
  `/// <reference lib="…" />` directives from the configured entry libs using
  the compiler's own preprocessor, copies the result into `public/ts-lib/`, and
  writes `manifest.json` recording the TypeScript version and a per-file SHA-384
  digest. Wired as `predev`, `prebuild`, and `pretest` so a fresh clone works,
  with the generated output gitignored.
- Add `scripts/harness/`: a standalone Vite entry that mounts the client outside
  the application's route graph, used to verify the round trip in a real browser
  and to inspect the emitted chunks without adding a page the docs shell owns.
- Add unit tests: a real round trip through TypeScript 6.0.3 in Node, message
  chain flattening, 1-based position mapping, `matchesExpected` across matched /
  unmet / unexpected cases, manifest-versus-installed version drift, and an
  assertion that the compiler is absent from the main bundle.

Routes: none added, changed, or removed. This change ships no page, no component
and no lesson; it is the engine the lesson engine will mount.

## Non-goals

- **NO dual-pane UI**: no `DualPane.vue`, `DiagnosticsList.vue`, `LessonPage.vue`
  or any other component. `add-lesson-engine` owns those and consumes
  `useTypecheck()`.
- **NO curriculum data** and no compiler-truth suite over lessons.
  `add-curriculum-model` and `add-lesson-engine` own those; this change only
  publishes the `matchesExpected()` primitive they run on.
- **NO docs shell, stores, router, or page edits** — a sibling change owns
  `src/layout/`, `src/overlays/`, `src/stores/`, `src/pages/`, `src/router.ts`,
  `src/App.vue`, `src/main.ts`, and `src/styles/`.
- **NO Playwright specs and no visual baselines**: `add-e2e-coverage` owns
  `tests/e2e/`. Browser verification here is manual against the harness.
- **NO new runtime dependency**: no `@typescript/vfs`, no editor package, no
  CDN. The host is first-party.
- **NO TypeScript upgrade** and no `@typescript/native-preview`; 6.0.3 stays
  pinned exactly.
- **NO code execution**: the worker parses and type-checks learner source and
  never runs it — no `eval`, no `Function`, no dynamic import of learner text.
- **NO cross-origin fetch at runtime**, and no network access beyond the lazy
  same-origin lib files.

## Capabilities

### New Capabilities

- `typecheck-worker`: in-browser type checking of learner-authored TypeScript —
  the virtual compiler host, the worker that owns the compiler, same-origin lazy
  standard-library delivery, the debounced main-thread client and composable,
  the expected-diagnostic matcher, and the build step that produces the lib
  payload.

### Modified Capabilities

_None — `repo-scaffold` reserved `scripts/`, `public/`, ES-module worker
support, and the `tests/unit` layout for exactly this change, and none of its
requirements change._

## Impact

- New source directory `src/typecheck/` (the shared `types.ts` contract already
  lives there and is not restructured), new `scripts/sync-ts-libs.mjs` and
  `scripts/harness/`, new tests under `tests/unit/`.
- `package.json` gains `sync:ts-libs`, the `predev`/`prebuild`/`pretest` hooks
  that run it, and the two harness scripts. No dependency is added, removed, or
  moved: `typescript@6.0.3` is already installed and stays a devDependency, and
  the worker chunk is produced at build time.
- `.gitignore` gains the generated `public/ts-lib/` payload and the harness
  build directory.
- Adds a build-time coupling: `public/ts-lib/` must be regenerated whenever
  `typescript` changes. The drift test makes a desync fail `pnpm test` rather
  than surface as broken diagnostics in a lesson.
- Fixes the API surface `add-lesson-engine` and `add-learner-features` build
  against: `useTypecheck()`, `createTypecheckClient()`, and
  `matchesExpected()`.
