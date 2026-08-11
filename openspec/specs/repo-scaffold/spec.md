# repo-scaffold Specification

## Purpose
The buildable baseline for ts-school: a pinned toolchain, a hardened dependency
install, a CSP-bearing static build that prerenders every route, the quality
gates that guard it, and the stable interfaces every later change extends.
## Requirements
### Requirement: pinned toolchain

The repository MUST pin its toolchain to node 24.17.0 and pnpm 11.18.0 in a
`mise.toml` at the repo root, and `package.json` SHALL declare
`engines.node >= 24` and `packageManager: pnpm@11.18.0` so a mismatched
environment fails loudly instead of silently building against another runtime.

#### Scenario: contributor's ambient node is older than the pin

- **GIVEN** a workstation whose bare `node` on `PATH` resolves to a version
  below 24
- **WHEN** the contributor runs the repo's commands through the pinned
  toolchain (`mise exec -- …` or an activated mise shell)
- **THEN** `node -v` reports `v24.17.0` and `pnpm -v` reports `11.18.0`

#### Scenario: package manager mismatch is detectable

- **GIVEN** a clone of the repository
- **WHEN** any tool reads `package.json`
- **THEN** it finds `engines.node` requiring `>=24` and `packageManager` naming
  `pnpm@11.18.0`, so corepack and CI resolve the same pnpm as local dev

### Requirement: hardened dependency install

`.npmrc` MUST configure supply-chain hardening: lifecycle scripts blocked by
default, a `minimum-release-age` delay on newly published packages with an
explicit `@vanduo-oss/*` exclusion, no trust-level downgrades, exotic
transitive sources blocked, exact version saving, strict peer dependencies, and
an explicit registry. Any package that genuinely needs a build script SHALL be
allowlisted individually rather than by relaxing `ignore-scripts`.

#### Scenario: a fresh install honours the hardening

- **GIVEN** a clean clone with no `node_modules`
- **WHEN** a contributor installs dependencies
- **THEN** the install completes without executing any lifecycle script that is
  not explicitly allowlisted, and resolves every package from the configured
  registry

#### Scenario: first-party packages are not delayed

- **GIVEN** a freshly published `@vanduo-oss/*` version younger than the
  configured `minimum-release-age`
- **WHEN** it is added as a dependency
- **THEN** the install accepts it, because the `@vanduo-oss/*` scope is excluded
  from the delay

### Requirement: VDL engines install without sibling clones

A clean clone of ts-school MUST install `@vanduo-oss/vdl-ai-chat` and
`@vanduo-oss/vdl-hybrid-search` from the npm registry with `pnpm install`
alone. Local and CI workflows MUST NOT require cloning, symlinking, or
building those repositories as a prerequisite to install or build ts-school.

#### Scenario: contributor installs without VDL siblings
- **GIVEN** a clean clone and no `../0_vanduo/vdl-*` checkouts
- **WHEN** the contributor runs `mise exec -- pnpm install`
- **THEN** both VDL engine packages install successfully from the registry

#### Scenario: CI install has no VDL sibling checkout steps
- **GIVEN** the GitHub Actions workflows for CI, Pages, and visual baselines
- **WHEN** a maintainer inspects the install steps
- **THEN** those workflows run `pnpm install` without checkout/link/build
  steps for `vdl-ai-chat` or `vdl-hybrid-search`

### Requirement: TypeScript dual install (7 + Strada 6)

`typescript` MUST be pinned to exactly `7.0.2`. The repository MUST also
declare `typescript-strada` as `npm:typescript@6.0.3` for the programmatic
Compiler API used by diagnostic generation, compiler-truth, and `vue-tsc`.
Browser source MUST NOT value-import either package. The dual-install rationale
SHALL be recorded in README and `openspec/config.yaml`.

#### Scenario: a maintainer inspects the TypeScript pins

- **GIVEN** a maintainer who opens `package.json` and the README
- **WHEN** they read the TypeScript dual-install section
- **THEN** they see `typescript@7.0.2` as the primary package and
  `typescript-strada@6.0.3` as the Strada API used at build/CI time — not in
  the browser

#### Scenario: vue-tsc still typechecks Vue SFCs

- **GIVEN** the installed dependency tree
- **WHEN** `pnpm typecheck` runs
- **THEN** it succeeds via the Strada-backed vue-tsc wrapper

### Requirement: strict Content-Security-Policy on the HTML entry

`index.html` MUST carry a Content-Security-Policy `<meta>` tag that at minimum
sets `default-src 'self'`, `script-src 'self'`,
`connect-src 'self'`, `img-src 'self' data:`, `font-src 'self'`,
`object-src 'none'`, and `base-uri 'none'`. The policy SHALL be the narrowest
one under which both the dev server and the prerendered production build
actually run, and SHALL NOT declare directives a `<meta>` policy cannot deliver
(`frame-ancestors`, `report-uri`, `sandbox`) — those SHALL be documented as
response headers for any server that later fronts the built files. The policy
SHALL NOT require `worker-src` now that the in-browser checker is gone.

#### Scenario: the built site loads with no CSP violation

- **GIVEN** a completed `vite-ssg` build served as static files
- **WHEN** a browser loads any prerendered route
- **THEN** the page renders and the console reports no
  Content-Security-Policy violation and no ignored-directive error

#### Scenario: remote code and document hijacking are refused

- **GIVEN** the deployed policy
- **WHEN** a script from another origin, a plugin object, or a `<base>`
  override is evaluated against it
- **THEN** each is refused by `script-src 'self'`, `object-src 'none'`, and
  `base-uri 'none'` respectively

#### Scenario: no build output depends on an inline script

- **GIVEN** the prerendered HTML emitted by the build
- **WHEN** it is inspected for `<script>` elements
- **THEN** every one of them loads a same-origin file and none carries inline
  code, because `script-src 'self'` would block it

### Requirement: static build prerenders every route

The production build MUST run through `vite-ssg` so every route is emitted as a
static HTML file that is meaningful before hydration, and the dev server MUST
serve the same application.

#### Scenario: build emits prerendered HTML for the placeholder routes

- **GIVEN** a clean checkout with dependencies installed
- **WHEN** the build script runs
- **THEN** it exits zero and `dist/index.html` contains the home page's
  server-rendered markup, not an empty mount point

#### Scenario: dev server serves the placeholder home page

- **GIVEN** a clean checkout with dependencies installed
- **WHEN** the dev script runs and the served root URL is requested
- **THEN** the placeholder home page is returned

### Requirement: quality gates pass on a clean checkout

The repository MUST expose scripts for linting, style linting, formatting
checks, type checking, unit tests, and the production build; all of them SHALL
pass on a clean checkout, and CI SHALL run them on push and pull request.

#### Scenario: a contributor runs the full gate locally

- **GIVEN** a clean clone with dependencies installed
- **WHEN** the lint, stylelint, format-check, typecheck, unit-test, and build
  scripts are each run
- **THEN** every one of them exits zero

#### Scenario: CI enforces the same gate

- **GIVEN** a push or pull request against the default branch
- **WHEN** the CI workflow runs
- **THEN** it executes lint, stylelint, format check, typecheck, unit tests, and
  the build, and fails the run if any of them fails

#### Scenario: no deploy pipeline exists

- **GIVEN** the repository's workflow directory
- **WHEN** it is inspected
- **THEN** it contains the CI workflow only — no deploy job, no GitHub Pages
  configuration, and no CNAME, because the site is local-only

### Requirement: stable interfaces for follow-on changes

The scaffold MUST fix the contact points that later changes are written against
in parallel: `src/router.ts` SHALL export a `buildRoutes()` function returning
the application's route records; the `@` import specifier SHALL resolve to
`src/` in the app build, the type checker, and the unit-test runner alike; unit
tests SHALL live under `tests/unit/` with a shared `tests/unit/setup.ts`;
end-to-end tests SHALL live under `tests/e2e/`; a `scripts/` directory SHALL
exist for build-time generators; ES-module Web Workers constructed with
`new Worker(new URL(…, import.meta.url), { type: "module" })` SHALL be
supported by the bundler; and files in `public/` SHALL be served under
`import.meta.env.BASE_URL`.

#### Scenario: the curriculum change adds derived routes

- **GIVEN** a later change that derives lesson routes from curriculum data
- **WHEN** it appends those records to what `buildRoutes()` returns
- **THEN** no change to the application bootstrap is required, because
  `buildRoutes()` is already the single route source it consumes

#### Scenario: the worker change constructs a module worker

- **GIVEN** a later change that instantiates a type-checking Web Worker with
  `new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })`
- **WHEN** the site is built
- **THEN** the worker is emitted as an ES module and loads at runtime under the
  site's `worker-src` policy

#### Scenario: a test file resolves the alias

- **GIVEN** a unit test placed in `tests/unit/`
- **WHEN** it imports application code through the `@` alias
- **THEN** the import resolves under both the unit-test runner and the type
  checker, and the shared setup file has already run

### Requirement: no premature feature code

At the end of this change the repository SHALL contain no docs-shell layout or
overlay components, no curriculum data, no type-checking worker, no lesson
engine, and no end-to-end test specs or visual baselines — only the scaffold
and the placeholder pages needed to prove the build is green.

#### Scenario: the source tree holds the scaffold only

- **GIVEN** the repository immediately after this change is applied
- **WHEN** `src/` is listed
- **THEN** it contains the application bootstrap, `App.vue`, `router.ts`, the
  placeholder home and not-found pages, and shell-only styles — and no
  `curriculum/`, `layout/`, `overlays/`, `stores/`, or worker module

#### Scenario: the e2e directory is configured but empty

- **GIVEN** the Playwright configuration pointing at `tests/e2e/`
- **WHEN** that directory is listed
- **THEN** it contains no spec file and no committed visual baseline, because
  end-to-end coverage belongs to a later change

