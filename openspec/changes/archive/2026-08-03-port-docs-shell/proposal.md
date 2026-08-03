## Why

The curriculum has 201 lessons and no way to walk between them. `App.vue` still
renders a bare router outlet, so every page is an island: no navbar, no sidebar,
no search, no theme control. `vd3-docs` — the sibling repo on the same stack —
already solved this, and its shell is proven against 102 pages, so the shell is
ported rather than invented.

The port is not a copy. Three things force adaptation:

1. `vd3-docs` feeds its shell a hand-written `nav.ts`. Here the tree is derived
   from the curriculum, so the sidebar gains a tier axis and the search index
   covers 201 lessons that nobody listed by hand.
2. Several `vd3-docs` components predate the published package and re-implement
   what `@vanduo-oss/vd3` now exports, or use CSS classes that only exist in
   `vd3-docs`' own 3,700-line stylesheet. Copying those would import an invented
   API and a stylesheet this project's house rules forbid.
3. `GlobalSearchModal.vue` highlights matches with `v-html` and builds the
   escaped string via `innerHTML`. Both are ESLint errors here.

## What Changes

- Add `src/layout/`: `SchoolLayout.vue` (the sidebar-plus-content frame that
  replaces `DocsLayout`), `SchoolNavbar.vue`, `SchoolSidebar.vue`,
  `SchoolSidebarFilter.vue`, `SchoolFooter.vue`.
- Add `src/components/SchoolBrandMark.vue`: the inline-SVG brand mark, matching
  the existing favicon.
- Add `src/overlays/GlobalSearchModal.vue`: the cmd+K palette, rebuilt on
  `VdModal` and the package's `vd-doc-search-*` markup contract, with
  highlighting rendered as text nodes and a `<mark>` element rather than as
  HTML.
- Add `src/stores/`: `nav.ts` (sidebar filter and active tier tab), `search.ts`
  (index derived from `@/nav`, ranking, grouping, keyboard cursor), `theme.ts`
  (site theme policy over the package's `useThemePreference()` singleton).
- Modify `src/App.vue`: navbar, layout, footer, search modal, and toast
  container around the router outlet; theme initialised on mount.
- Modify `src/router.ts`: lesson routes carry `meta.layout = "lesson"` so the
  shell knows which routes get the sidebar.
- Modify `src/pages/home.vue`: a real landing page instead of the scaffold
  placeholder, and remove the three invented `vd-*` class names it was using.
- Modify `index.html` and `src/App.vue` metadata for the TypeScript School
  brand.
- Extend `src/styles/app.css` with the shell's layout rules only.
- Add `tests/unit/search-store.spec.ts` and `tests/unit/theme-store.spec.ts`.

Routes: none added, changed, or removed. Lesson routes gain a `meta.layout`
value; their paths and components are untouched.

## Non-goals

- **NO `LiveCustomizer.vue`, `src/customizer/`, or `src/components/customizer/`.**
  That is a live playground for vd3 components, and this site documents none.
- **NO port of `vd3-docs/src/styles/docs.css`** (3,735 lines). The shell is
  expressed in the package's own classes; `app.css` gains layout only.
- **NO lesson-engine work.** `LessonPage.vue` is still the placeholder.
- **NO progress meters, quizzes, or exercises.**
- **NO history, about, or changelog pages.** `add-supporting-pages` owns those.
- **NO Playwright specs and no visual baselines.** `add-e2e-coverage` owns them.
- **NO `initialState` in `main.ts`.** The stores are client-side; populating
  vite-ssg's initial state would emit an inline script the CSP blocks.

## Capabilities

### New Capabilities

- `docs-shell`: the persistent application frame — navbar with brand and
  actions, tier-aware sidebar with filter, footer, global search over the
  derived index, theme switching and customisation — plus the stores behind
  them.

### Modified Capabilities

- `curriculum-model`: no requirement changes. The derived `NavTree` is consumed
  for the first time, which is what it was specified for.

## Impact

- `src/App.vue` gains the shell; every prerendered page grows by the navbar,
  sidebar, and footer markup.
- Two client-only concerns are introduced — theme hydration from
  `localStorage` and the search modal's keyboard listeners — both registered in
  `onMounted` so the prerender stays clean.
- Fixes the surface `add-lesson-engine` renders into: `SchoolLayout` supplies
  the sidebar and content column, so the engine only replaces the body of
  `LessonPage.vue`.
- Confirms that Phosphor icons and the UI fonts need no `public/` assets: they
  are shipped inside `@vanduo-oss/vd3/css` and emitted same-origin by Vite,
  which the `font-src 'self'` policy requires.
