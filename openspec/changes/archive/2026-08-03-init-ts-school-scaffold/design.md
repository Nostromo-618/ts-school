## Context

See `proposal.md` — Why. The constraints that shape the approach:

- `vd3-docs` runs the identical stack and is the source the config is ported
  from, but it was built pre-launch against `link:../` working trees and it
  deploys to GitHub Pages. ts-school does neither.
- Later changes are authored in parallel by separate agents. Anything they
  share has to be decided here or they conflict.
- The in-browser type checker does not exist yet, but its two hard
  requirements — a JS TypeScript compiler and a module Web Worker — constrain
  choices that are made in this change and are expensive to reverse.

## Goals / Non-Goals

**Goals:**

- A clean checkout where `install`, `lint`, `stylelint`, `format:check`,
  `typecheck`, `test`, and `build` all pass, with nothing stubbed out to make
  them pass.
- Interfaces frozen early enough that parallel changes never touch the same
  file to get started.
- A CSP that the later worker, `public/ts-lib/` fetches, and vd3's inline
  styles all live under without being widened later.

**Non-Goals:**

- Design of the curriculum model, the compiler host, or the lesson engine.
  This change only leaves room for them.
- Bundle-size budgets and performance tuning; there is nothing to measure yet.

## Decisions

### Port `vd3-docs`' config rather than generate a fresh Vite scaffold

The alternative — `npm create vue@latest` — produces a tree that then has to be
reconciled with vd3's conventions (ViteSSG entry shape, the `@vanduo-oss/*` CSS
imports, `dedupe`, `ssr.noExternal`, the ESLint/Prettier division of labour).
Porting from the sibling repo starts from a configuration already proven
against these exact packages, and keeps the two repos legible to the same
reader.

### Simplify `vite.config.ts` for published packages

`vd3-docs` carries three pre-launch leftovers: `server.fs.allow` entries
pointing at sibling working trees, `dedupe: ["vue", "pinia"]`, and
`optimizeDeps.exclude` for both `@vanduo-oss/*` packages. ts-school consumes
the published tarballs from the registry, so the packages live inside the
project root and none of that applies. Dropped: `server.fs.allow` and the
`pinia` dedupe entry. Kept: `dedupe: ["vue"]`, because a duplicate Vue copy
between the app and a dependency's prebundle is still the classic failure mode,
and `ssr.noExternal` for both packages, because SSG must transform their Vue
SFCs rather than `require()` them.

### `worker: { format: "es" }` set now, not when the worker lands

Vite's default worker format is `iife`, which cannot use `import`. The
type-check worker imports `typescript`, so it must be an ES module. Setting the
format here means `add-typecheck-worker` writes a worker and it works, instead
of discovering a build-config problem mid-change. It costs nothing while no
worker exists.

### `style-src 'self' 'unsafe-inline'` — the narrowest policy that works

Everything else in the policy is `'self'` or `'none'`. `style-src` is the one
exception, and it is forced: Vue's scoped styles, vd3's runtime theming, and
`vite-ssg`'s prerendered markup all emit inline `style` attributes and inline
`<style>` blocks. A nonce cannot be used because the site is served as static
files with no origin server to mint one per response, and hashes cannot cover
attribute-level inline styles at all. `unsafe-inline` on `style-src` does not
enable script execution; `script-src 'self'` still governs that. The choice is
recorded so it does not get re-litigated, and it is the only widening in the
policy.

Alternatives considered: `style-src 'self'` with all styles extracted — breaks
scoped styles and vd3 theming; a build-time nonce — meaningless for a static
site, since the nonce would be a constant baked into the HTML.

### `buildRoutes()` as the route seam

`vd3-docs` already exports `buildRoutes()`, so the shape is house style. Here
it matters more: the curriculum change generates lesson routes from data and
needs one place to contribute them without editing `main.ts`. This change ships
`buildRoutes()` returning the placeholder home and the catch-all, with the
lesson routes to be spliced in ahead of the catch-all.

### Allowlist build scripts individually in `pnpm-workspace.yaml`

`ignore-scripts=true` blocks `esbuild`'s and Playwright's postinstall, without
which Vite cannot start and the browser binaries are never fetched. The
allowlist names exactly those two rather than relaxing the global setting, so
the hardening stays intact for the other several hundred packages.

## Risks / Trade-offs

- **`vd3-docs` patches `vite-ssg@28.3.0`** to drop the deprecated `next()`
  callback in its `router.beforeEach` guard, which vue-router 5 warns about →
  Port the same patch. It is a two-line upstream fix
  (antfu-collective/vite-ssg#467); without it every prerendered page logs a
  router deprecation warning.
- **`save-exact=true` fights the caret ranges in the dependency list** → Ranges
  are written into `package.json` deliberately for the packages where vd3-docs
  uses them; the lockfile is what actually pins the install, and `save-exact`
  only governs what future `pnpm add` invocations write.
- **CSP is enforced from a `<meta>` tag, not a response header** → Browsers
  ignore `frame-ancestors` (and `report-uri`, and `sandbox`) in a meta policy
  and log an error for each, so those are omitted and recorded in the README as
  headers for any server that later fronts the build. A meta policy is the only
  mechanism a static site has, and it still blocks the injection classes that
  matter here.
- **`script-src 'self'` forbids vite-ssg's initial-state script** → vite-ssg
  serializes any non-empty `initialState` into an inline `<script>`, which the
  policy blocks. Nothing in ts-school needs SSR-hydrated state (learner
  progress is read from `localStorage` on the client), so `main.ts` leaves
  `initialState` untouched and `serializeState` emits nothing. A later change
  that wants prerendered data must carry it in route meta or fetch it
  same-origin rather than reintroducing the inline script.
- **Placeholder pages will be replaced wholesale** by `port-docs-shell` → They
  are deliberately thin: enough markup to prove SSG prerenders real content,
  not a design to preserve.

## Migration Plan

Not applicable — greenfield repository, nothing to migrate, no deploy to roll
back.
