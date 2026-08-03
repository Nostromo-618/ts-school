# Tasks

## 1. Toolchain and install hardening

- [x] 1.1 Create `mise.toml` pinning node 24.17.0 and pnpm 11.18.0; run
      `mise trust` and verify `mise exec -- node -v` reports 24.17.0 and
      `mise exec -- pnpm -v` reports 11.18.0.
- [x] 1.2 Copy the `vd3-docs` `.npmrc` hardening (`ignore-scripts`,
      `minimum-release-age=1440` with `minimum-release-age-exclude[]=@vanduo-oss/*`,
      `trust-policy=no-downgrade`, `block-exotic-subdeps`, `save-exact`,
      `strict-peer-dependencies`, explicit registry), retitled for ts-school.
- [x] 1.3 Create `pnpm-workspace.yaml` with the `unhead` peer allowance vite-ssg
      needs. No `onlyBuiltDependencies` entry proved necessary: vite 8 bundles
      rolldown (prebuilt bindings, no install script) and Playwright fetches
      browsers on demand, so nothing in the tree has a blocked lifecycle
      script — an audit of all 461 installed packages found only `prepare`
      scripts, which registry tarballs never run.
- [x] 1.4 Create `.gitignore` (node_modules, dist, .vite, tsconfig.tsbuildinfo,
      playwright-report, test-results, coverage, logs, `.DS_Store`).

## 2. Dependency manifest

- [x] 2.1 Author `package.json`: private, `type: module`, `engines.node >= 24`,
      `packageManager: pnpm@11.18.0`, and the vd3-docs script set (`dev`,
      `build`, `preview`, `lint`, `lint:fix`, `stylelint`, `format`,
      `format:check`, `typecheck`, `test`, `test:watch`, `test:e2e`), plus
      `test:coverage` so `@vitest/coverage-v8` is reachable.
- [x] 2.2 Install runtime dependencies at the verified versions with
      `--safe-chain-skip-minimum-package-age`: `@vanduo-oss/vd3@1.2.1`,
      `@vanduo-oss/vd3-cbun@1.3.1`, `vue`, `vue-router`, `pinia`,
      `@unhead/vue@2.1.15`.
- [x] 2.3 Install the dev toolchain: vite, vite-ssg, `@vitejs/plugin-vue`,
      vue-tsc, vitest + coverage, `@vue/test-utils`, `@vue/tsconfig`, jsdom,
      Playwright + axe, eslint stack, prettier, stylelint stack,
      `@types/node`.
- [x] 2.4 Pin `typescript` to exactly `6.0.3` (no range) and record why in
      `README.md` and `openspec/config.yaml` — TS 7 is a Go binary with no
      programmatic API and cannot run in a browser.
- [x] 2.5 Port the `vite-ssg@28.3.0` patch that drops the deprecated `next()`
      callback from its router guard, and register it in `pnpm-workspace.yaml`.

## 3. Build, type, and quality configuration

- [x] 3.1 Create `vite.config.ts`: `base` from `VITE_BASE`, `@` → `./src`,
      `__APP_VERSION__` define, `dedupe: ["vue"]`, `ssr.noExternal` for both
      `@vanduo-oss/*` packages, `worker: { format: "es" }`, `build.target`
      raised to `es2022` so the worker can use top-level await. Dropped the
      `link:../` leftovers (`server.fs.allow`, `pinia` dedupe,
      `optimizeDeps.exclude`).
- [x] 3.2 Create `tsconfig.json` (extends `@vue/tsconfig/tsconfig.dom.json`,
      strict, `@/*` path, includes `src`, `tests`, `env.d.ts`) and `env.d.ts`
      declaring `__APP_VERSION__` and the CSS side-effect modules actually
      imported.
- [x] 3.3 Create `eslint.config.js`, `stylelint.config.js`, and
      `.prettierrc.json`. ESLint additionally forbids `eval`, the `Function`
      constructor, `javascript:` URLs, `innerHTML` assignment, and `v-html`,
      so the project's security posture is enforced rather than documented.
- [x] 3.4 Create `vitest.config.ts` (jsdom, `tests/unit/**/*.spec.ts`, setup at
      `tests/unit/setup.ts`) and `tests/unit/setup.ts`.
- [x] 3.5 Create `playwright.config.ts` pointed at `tests/e2e/`, keeping the
      vd3-docs project matrix, with `test:e2e` targeting Chromium Desktop.
      Wrote no spec files.

## 4. Application shell

- [x] 4.1 Create `index.html` with the strict CSP meta tag and the module
      script entry.
- [x] 4.2 Create `src/main.ts`: ViteSSG bootstrap with
      `base: import.meta.env.BASE_URL`, routes from `buildRoutes()`, a
      `scrollBehavior`, Pinia, and `VanduoVue`; import
      `@vanduo-oss/vd3/css` plus only the cbun charts, code-editor, and
      flowchart CSS.
- [x] 4.3 Create `src/App.vue` with per-route `useHead` metadata, a skip link,
      and the router outlet.
- [x] 4.4 Create `src/router.ts` exporting `buildRoutes(): RouteRecordRaw[]`,
      structured so derived lesson routes can be spliced in ahead of the
      catch-all.
- [x] 4.5 Create placeholder `src/pages/home.vue` and `src/pages/not-found.vue`,
      and shell-only `src/styles/app.css`.
- [x] 4.6 Create the directories later changes write into: `scripts/`,
      `public/`, `tests/e2e/`.

## 5. CI

- [x] 5.1 Create `.github/workflows/ci.yml` running install, lint, stylelint,
      format check, typecheck, unit tests, and build on push and pull request,
      with least-privilege permissions and SHA-pinned actions. No deploy job.

## 6. Verification

- [x] 6.1 `pnpm install` completes with the hardened `.npmrc` and no
      unauthorised lifecycle scripts; `--frozen-lockfile` also succeeds, so CI
      installs reproducibly.
- [x] 6.2 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`, and
      `pnpm typecheck` all pass.
- [x] 6.3 `pnpm test` passes — 15 assertions across the `buildRoutes()`
      contract and the CSP directive set.
- [x] 6.4 `pnpm build` prerenders `/` with real markup (`<h1>TypeScript
      School</h1>` and the route title are in the emitted HTML). The
      `/:pathMatch(.*)*` catch-all is a dynamic route, so `vite-ssg` cannot
      prerender it; it resolves client-side via the host's SPA fallback, which
      `vite preview` confirmed.
- [x] 6.5 `pnpm dev` (port 5173) and `pnpm preview` (port 8787) both serve the
      placeholder home page with **zero** console errors or warnings under the
      CSP. Two violations found during verification and fixed:
      `frame-ancestors` is ignored in a `<meta>` policy and logged an error, so
      it moved to a documented response-header requirement; and vite-ssg's
      inline `window.__INITIAL_STATE__` script was blocked by
      `script-src 'self'`, so `main.ts` no longer populates `initialState` and
      the build emits no inline script at all.
- [x] 6.6 Confirmed the interface contracts: `buildRoutes()` export (unit
      tested), `@` alias resolving under vite + vue-tsc + vitest,
      `tests/unit/setup.ts`, `tests/e2e/`, `scripts/`, `public/` served at
      `import.meta.env.BASE_URL`, and `worker: { format: "es" }` — verified by
      building a throwaway module worker, checking the emitted chunk carried
      `{ type: "module" }`, and removing it.
- [x] 6.7 `openspec validate init-ts-school-scaffold --strict` passes.
