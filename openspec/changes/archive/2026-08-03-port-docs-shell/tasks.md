# Tasks

## 1. Layout frame

- [x] 1.1 Add `src/layout/SchoolLayout.vue`: the sidebar-plus-content frame
      replacing vd3-docs' `DocsLayout`, with a skip-to-content link and a
      `<main>` landmark.
- [x] 1.2 Add `src/layout/SchoolNavbar.vue`, `SchoolSidebar.vue`,
      `SchoolSidebarFilter.vue`, and `SchoolFooter.vue`, built from published
      `@vanduo-oss/vd3` components only — no site component shadows a package
      component and no invented `vd-*` class names.
- [x] 1.3 Add `src/components/SchoolBrandMark.vue`: the inline-SVG brand mark
      matching the favicon.

## 2. Overlays and stores

- [x] 2.1 Add `src/overlays/GlobalSearchModal.vue`: the cmd+K palette on
      `VdModal` and the package's `vd-doc-search-*` markup contract, rendering
      match highlights as text nodes plus a `<mark>` element — never `v-html`
      or `innerHTML` (ESLint enforces both).
- [x] 2.2 Add `src/overlays/SchoolThemeSwitcher.vue` and the theme
      customisation control, both driving the package's `useThemePreference()`
      singleton so they stay in step and the preference persists across reload.
- [x] 2.3 Add `src/stores/nav.ts` (sidebar filter + active tier tab),
      `src/stores/search.ts` (index derived from `@/nav`, ranking, grouping,
      keyboard cursor), and `src/stores/theme.ts` (site theme policy).

## 3. Wiring

- [x] 3.1 Modify `src/App.vue`: navbar, layout, footer, search modal, and toast
      container around the router outlet; theme initialised on mount.
- [x] 3.2 Modify `src/router.ts`: lesson routes carry `meta.layout = "lesson"`;
      no route path or component changes.
- [x] 3.3 Modify `src/pages/home.vue`: a real landing page replacing the
      scaffold placeholder, with no invented class names.
- [x] 3.4 Rebrand `index.html` and `App.vue` metadata for TypeScript School;
      no donor branding survives.
- [x] 3.5 Extend `src/styles/app.css` with shell layout rules only — component
      styling stays in the vd3 package.

## 4. Assets

- [x] 4.1 Serve Phosphor icons and fonts same-origin so they render under the
      strict CSP, with no redundant asset copy and icon names verified against
      the package before use.

## 5. Tests and verification

- [x] 5.1 Add `tests/unit/search-store.spec.ts` (index derived from the
      curriculum, ranking, grouping, keyboard cursor) and
      `tests/unit/theme-store.spec.ts` (preference persistence, prerender-safe).
- [x] 5.2 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`, and
      `pnpm typecheck` pass.
- [x] 5.3 `pnpm test` passes.
- [x] 5.4 `pnpm build` prerenders every route clean; the shell appears on all
      pages and the deep-link and navigation scenarios hold.
- [x] 5.5 `openspec validate port-docs-shell --strict` passes, then archive.
