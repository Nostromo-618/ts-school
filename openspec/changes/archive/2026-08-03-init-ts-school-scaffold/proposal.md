## Why

`ts-school` is an empty repository. Every subsequent change — the docs shell
port, the curriculum model, the in-browser typecheck worker, the lesson engine,
the content tiers — needs a toolchain, a build, and a set of quality gates to
land against. Several of those changes are authored in parallel, so the
scaffold must also fix the interfaces they share (`buildRoutes()`, the `@`
alias, the test directory layout, module-worker support) before any of them
starts, or they will collide.

The scaffold is lifted from `vd3-docs`, the sibling repo running the same
stack, so the tooling is proven rather than invented. Two deliberate
simplifications apply: `vite.config.ts` drops the `link:../` leftovers
(`server.fs.allow`, `dedupe: ["pinia"]`) because ts-school consumes the
published `@vanduo-oss/*` packages, and there is no deploy pipeline because
this site is local-only.

## What Changes

- Add `mise.toml` pinning node 24.17.0 and pnpm 11.18.0. The plain shell
  resolves an older node, so the pin is load-bearing, not decorative.
- Add `.npmrc` with the vd3-docs supply-chain hardening verbatim
  (`ignore-scripts`, `minimum-release-age=1440` with an `@vanduo-oss/*`
  exclusion, `trust-policy=no-downgrade`, `block-exotic-subdeps`,
  `save-exact`, `strict-peer-dependencies`, explicit registry) plus
  `pnpm-workspace.yaml` allowlisting the build scripts that hardening blocks.
- Add `package.json`: private, `type: module`, `engines.node >= 24`,
  `packageManager: pnpm@11.18.0`, the vd3-docs script set (`dev`, `build` via
  `vite-ssg build`, `preview`, `lint`, `lint:fix`, `stylelint`, `format`,
  `format:check`, `typecheck`, `test`, `test:watch`, `test:e2e`), and the
  dependency set with `typescript` **pinned to exactly `6.0.3`**.
- Add the build and quality configs: `vite.config.ts`, `tsconfig.json`,
  `env.d.ts`, `eslint.config.js`, `stylelint.config.js`, `.prettierrc.json`,
  `.gitignore`, `vitest.config.ts`, `playwright.config.ts`.
- Add `index.html` carrying a strict Content-Security-Policy meta tag, and the
  minimal runnable app behind it: `src/main.ts` (ViteSSG bootstrap),
  `src/App.vue`, `src/router.ts` exporting `buildRoutes()`, placeholder
  `src/pages/home.vue` and `src/pages/not-found.vue`, and shell-only
  `src/styles/app.css`.
- Add `.github/workflows/ci.yml` running lint, stylelint, format check,
  typecheck, unit tests, and the vite-ssg build.
- Add the directory contracts follow-on changes write into: `tests/unit/`
  (with `setup.ts`), `tests/e2e/`, `scripts/`, `public/`.

Routes: `/` (placeholder home) and the `/:pathMatch(.*)*` not-found catch-all
are added. No lessons exist yet, so none are added, changed, or removed.

## Non-goals

- **NO docs shell**: no navbar, sidebar, breadcrumb, footer, search modal,
  theme switcher, or stores. Those land in `port-docs-shell`.
- **NO curriculum**: no `src/curriculum/`, no lesson data, no derived nav or
  search index. Those land in `add-curriculum-model`.
- **NO typecheck worker**: no `typescript` import outside `devDependencies`,
  no `public/ts-lib/`, no `scripts/sync-ts-libs.mjs`. That lands in
  `add-typecheck-worker`.
- **NO lesson engine, learner features, or content** of any kind.
- **NO Playwright specs**: `playwright.config.ts` is authored so a later
  change can drop specs into `tests/e2e/`, but this change writes no spec file
  and commits no visual baseline. `add-e2e-coverage` owns that.
- **NO deploy workflow, no GitHub Pages config, no CNAME, no git remote** —
  ts-school is local-only.
- **NO TypeScript 7** and no `@typescript/native-preview`.
- No edits to `vd3`, `vd3-cbun`, or `vd3-docs` — read-only reference material.

## Capabilities

### New Capabilities

- `repo-scaffold`: the toolchain pin, supply-chain hardening, dependency
  manifest, build/test/lint configuration, CSP-bearing HTML entry, the minimal
  ViteSSG application shell, and the CI gate — everything needed for
  `pnpm install`, `pnpm lint`, `pnpm stylelint`, `pnpm typecheck`, `pnpm test`,
  and `pnpm build` to pass on a clean clone.

### Modified Capabilities

_None — no specs exist before this change._

## Impact

- New local-only repo baseline; nothing is published or deployed.
- Introduces the full dependency tree (`@vanduo-oss/vd3` 1.2.1,
  `@vanduo-oss/vd3-cbun` 1.3.1, Vue 3.5, Vite 8, vite-ssg 28, vue-router 5,
  Pinia 3, `@unhead/vue` 2.1.15, and the dev toolchain) and a `pnpm-lock.yaml`.
- Fixes interfaces that `port-docs-shell`, `add-curriculum-model`,
  `add-typecheck-worker`, `add-lesson-engine`, and `add-e2e-coverage` all build
  on: `buildRoutes()` in `src/router.ts`, the `@` → `src/` alias, the
  `tests/unit` / `tests/e2e` split, `scripts/`, ES-module Web Worker support,
  and `public/` served under `import.meta.env.BASE_URL`.
- Pins `typescript` at `6.0.3`. An upgrade to 7.x would silently break the
  in-browser compiler before it is even written, so the pin is recorded in the
  spec, `package.json`, and `openspec/config.yaml`.
