## Context

See `proposal.md` — Why. The constraints that actually shape the code:

- `typescript@6.0.3` is the last compiler with a JS programmatic API. Its
  `typescript.js` is 8.7 MB of parser, binder, checker and emitter. That is
  acceptable in a worker chunk, fatal in the main bundle.
- The deployed CSP is `default-src 'self'; script-src 'self'; worker-src 'self'
  blob:; connect-src 'self'`. There is no `'unsafe-eval'`, no cross-origin
  fetch, and — because the site is a plain static build with no control over
  response headers — no `Cross-Origin-Opener-Policy` /
  `Cross-Origin-Embedder-Policy`, so the page is **not** cross-origin isolated
  and `SharedArrayBuffer` is unavailable.
- `src/typecheck/types.ts` is a shared contract already consumed by the
  curriculum change. It may be extended but not restructured.
- `vite.config.ts` already sets `worker.format: "es"` and `build.target:
  "es2022"`, and `base` is overridable through `VITE_BASE`, so the site can be
  hosted under a sub-path.
- The whole standard library closure for the `es2022` baseline is 57 files /
  459 KB; adding `dom` + `dom.iterable` costs a further 2.1 MB. Loading the DOM
  eagerly would be indefensible; loading it lazily is fine.

## Goals / Non-Goals

**Goals:**

- An API the lesson engine can bind to a `VdCodeEditor` in a few lines, with no
  knowledge of workers, message correlation, or the compiler.
- Bundle separation that is provable by inspection rather than asserted by
  convention.
- A compiler host small enough to read in one sitting and testable in plain Node
  without a browser, a DOM, or a filesystem.
- First diagnostic fast enough to feel live while typing, with the one-off cost
  of parsing the standard library paid on first use rather than at page load.

**Non-Goals:**

- No editor integration beyond a plain string in and diagnostics out — no
  completions, hovers, quick fixes, or a `ts.LanguageService`. `VdCodeEditor`
  has no surface for any of them.
- No multi-file lessons. One `lesson.ts` is the whole program.
- No module resolution. A lesson that imports anything gets an honest
  "cannot find module", which is the correct behaviour for a sandbox with no
  package graph.
- No emit. `noEmit` is fixed; the compiler is a checker here, and a JS emitter
  in the browser would be the beginning of an execution path.

## Decisions

### The host receives the compiler; it never imports it

`host.ts` declares `import type * as TsModule from "typescript"` and takes
`ts: TypeScriptApi` as a parameter. Only `worker.ts` performs a value import.

Alternatives considered. *Import `typescript` directly in `host.ts` and rely on
the bundler to tree-shake it out of the main graph*: rejected, because the
guarantee then depends on nobody ever importing `host.ts` from a component, and
a mistake would be invisible until someone measured a 5 MB main chunk.
*Dependency-inject via a global registered by the worker*: rejected as
indirection with no benefit. With a type-only import the separation is a
compile-time fact — the import is erased — and a static test over the source
graph can assert it cheaply.

The same choice is what makes the host testable: the Node test passes the
`typescript` it imports from `node_modules`, reads lib text off disk, and never
touches a browser API.

### A flat virtual filesystem keyed by basename

Files live at one virtual root, `/`. The map holds `lesson.ts` and each
`lib.*.d.ts` under its bare name, and every host method normalizes an incoming
path to its basename before lookup.

This is deliberate defence against the compiler's path handling rather than
laziness. `ts.createProgram` derives a default library directory from
`host.getDefaultLibFileName()`, joins lib reference directives onto it, and —
for each entry in `options.lib` — first attempts a Node-style resolution of an
`@typescript/lib-*` override package from the current directory. Matching every
one of those path shapes exactly would be brittle; normalizing to a basename
makes the lookup correct for all of them. Since the virtual filesystem has no
directories, no ambiguity is possible. It also means the host cannot be talked
into reading anything outside its map: `fileExists` answers `false` for
everything it was not given, so the `@typescript/lib-*` probe finds nothing and
falls back to the virtual root.

### Fixed compiler options, with exactly two lesson-controlled knobs

`TypecheckOptions` already defines `strict` and `libs`; nothing else is
exposed. The baseline is ES2022 / ESNext modules / bundler resolution,
`strict: true`, `noEmit: true`, `skipLibCheck` and `skipDefaultLibCheck` on,
`types: []`, and — the one non-obvious choice — `moduleDetection: "force"`.

Without `moduleDetection: "force"` a snippet with no import or export is a
*script*, so its top-level declarations land in the global scope and collide
with globals from the standard library. A lesson that writes `const name = "…"`
would be told `Cannot redeclare block-scoped variable 'name'` — a diagnostic
about our sandbox, not about the lesson. Forcing module semantics removes a
whole class of false teaching signals and enables top-level `await`, which
several async lessons will want.

`skipLibCheck` is on because the standard library is trusted input we shipped
ourselves, and checking it on every keystroke would dominate the budget.
`noUnusedLocals` / `noUnusedParameters` stay off: they fire constantly on
half-written code and would make the pane feel hostile mid-keystroke.

Only diagnostics for `lesson.ts` are returned — syntactic then semantic.
Program-wide options and global diagnostics are deliberately excluded: they
describe our configuration, not the learner's code.

### One long-lived session per worker, reusing source files and the old program

The worker holds a session that owns a `Map<string, ts.SourceFile>` cache keyed
by `<fileName>@<scriptTarget>` and the previous `ts.Program`. Every check
reparses only `lesson.ts` and passes `oldProgram` to `ts.createProgram`, so the
57-file standard library is parsed once per worker and the binder's work on it
is reused.

The cache is keyed by script target because a `SourceFile` records the target it
was parsed with; sharing one across targets would be subtly wrong even though
today only ES2022 is used. Lib source files are immutable `.d.ts` text, so
sharing them across programs is safe.

### No wire-level cancellation, because the platform cannot honour it

A Web Worker runs `ts.createProgram` synchronously. It cannot observe a
`cancel` message mid-check, because it will not return to its event loop until
the check finishes. The usual escape — a `SharedArrayBuffer` flag polled by a
`ts.CancellationToken` — requires cross-origin isolation, which a static site
with no response-header control cannot enable, and which our CSP is not set up
for either.

So cancellation is honest about what it can do, at three levels: the client
debounces at 250 ms so a keystroke burst never becomes a queue; `cancel()`
drops the pending debounce before it is dispatched; and the worker coalesces —
if a newer request arrives while one is running, only the newest queued request
is checked and the superseded ones are dropped without a response. Responses
that lose the race are discarded on arrival by request id. The net effect a
learner sees is the same as cancellation; the difference is that one in-flight
check always runs to completion, which at ~10 ms is not worth engineering
around.

The shared contract therefore gains no `cancel` message. Adding one would imply
a capability we cannot deliver.

### The standard library ships as individual files plus a digest manifest

`scripts/sync-ts-libs.mjs` starts from the entry libs (`es2022`, `dom`,
`dom.iterable`), reads each file out of `node_modules/typescript/lib`, and finds
its references with `ts.preProcessFile` — the compiler's own preprocessor —
recursing to a closure. It copies the closure to `public/ts-lib/` and writes
`manifest.json` with the compiler version, the entry libs, the default library
name, and per-file `{ bytes, integrity }` where integrity is an SRI-style
`sha384-…` digest.

Alternatives considered. *A hardcoded list*: rejected outright — it silently
rots on a compiler upgrade, which is exactly the failure the drift test exists
to prevent. *A regex over `/// <reference lib=…>`*: works today, but drifts from
the compiler's own notion of a reference; `preProcessFile` is public API and
costs nothing here. *One concatenated bundle per lib set*: fewer round trips,
but it discards per-file integrity, forces the DOM's 2.1 MB into the same
artifact granularity as the 1 KB `lib.es2022.d.ts`, and makes the served payload
un-inspectable. The 57 baseline files are fetched with one `Promise.all`, which
is one HTTP/2 connection in practice.

The manifest's `typescriptVersion` is what the drift test compares against the
installed `typescript`, so a version bump that forgets to regenerate the payload
fails `pnpm test` with both versions named.

### Generated output is gitignored and produced by pre-hooks

`public/ts-lib/` is a byte-for-byte copy of files that already exist in
`node_modules`; committing 2.5 MB of duplicated `.d.ts` would be noise in every
diff that touches the compiler version. Instead `sync:ts-libs` runs from
`predev`, `prebuild` and `pretest`, so `pnpm install && pnpm build` on a fresh
clone works, `pnpm test` always has a manifest to check, and the payload cannot
be stale relative to `node_modules`.

### Integrity is verified at runtime when the platform allows it

The worker hashes each fetched lib file with `crypto.subtle` and compares
against the manifest before handing it to the compiler; a mismatch throws and is
surfaced as an error response naming the file. Where `crypto.subtle` is absent —
a non-secure-context origin such as a plain-HTTP LAN preview — verification is
skipped rather than failing closed, because the same-origin fetch is already the
primary control and refusing to work over `http://` would break local preview
for no real gain. Cost is ~2 ms for the 459 KB baseline closure, paid once.

### The client is a plain object; the composable is a thin wrapper over it

`createTypecheckClient()` has no Vue dependency, takes an injectable worker
factory so it can be unit-tested against a fake worker, and returns
`{ check, checkNow, cancel, terminate, isSupported }`. `useTypecheck()` wraps it
in refs and, when called from a component, registers `onMounted` /
`onBeforeUnmount` itself so the call site cannot forget teardown.

SSR safety is structural, not defensive: the worker is constructed in
`onMounted`, which never runs on the server, and `isSupported` is false whenever
`Worker` is undefined, so the composable's refs simply hold their initial values
through prerender and hydration.

### Browser verification runs against a standalone harness, not a page

`src/pages/`, `src/router.ts` and `src/App.vue` belong to the docs-shell change,
and this change ships no component, so nothing in the application imports the
client yet — which would make "the compiler is absent from the main bundle" a
vacuous claim. `scripts/harness/` is a second Vite entry (its own `index.html`,
`main.ts` and config, `publicDir` pointed at the real `public/`) that mounts the
client for real. Building it produces a genuine main chunk that imports the
client and a genuine worker chunk, so the bundle assertion has something to
assert against, and the harness page is where round-trip latency is measured in
a browser.

The unit suite additionally asserts the source-graph invariant, which needs no
build at all.

## Risks / Trade-offs

- **8.7 MB of compiler in the worker chunk** → It is fetched lazily by the
  browser only when a lesson page constructs the worker, it is compressible to
  roughly a fifth of that over the wire, and it is cached across every lesson
  for the session. There is no smaller compiler with a programmatic API; this
  is the price of telling the truth about diagnostics.
- **The DOM library is 2.1 MB** → It is a separate lazy load, requested only by
  lessons that ask for `dom`, and cached per worker. Lessons should not ask for
  it out of habit.
- **`moduleDetection: "force"` differs from a bare `tsc lesson.ts`** → Documented
  in the host, and the compiler-truth suite runs through this same host, so
  authored expectations can never disagree with what learners see.
- **No true mid-check cancellation** → Bounded by how long one check takes
  (~10 ms warm); the debounce and coalescing keep the queue at zero or one.
- **The generated payload is not in git** → A consumer who runs a bare `vite
  build` instead of `pnpm build` gets no libs. Mitigated by the pre-hooks on
  every entry point that needs them, and by the drift test failing loudly.
- **Runtime integrity verification could reject on a stale HTTP cache** →
  `public/` assets are served unhashed, so a proxy holding an old `.d.ts` after
  a compiler upgrade would fail verification. The failure is explicit and names
  the file, which is better than feeding a mismatched library to the compiler
  and producing wrong diagnostics.
- **`.d.ts` is served as `video/mp2t`** → the `.ts` extension is registered to
  MPEG transport streams, and `vite preview` duly labels the library that way.
  Nothing breaks, because the worker reads the response as bytes and decodes it
  itself rather than trusting the type. It matters only for compression: many
  static hosts gzip by MIME type and would leave 459 KB uncompressed where
  81 KB would do. Any host fronting this build should map `.d.ts` to
  `text/plain` and compress it.
