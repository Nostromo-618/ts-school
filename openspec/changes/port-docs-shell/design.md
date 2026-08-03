# Design — porting the docs shell

## What was ported, what was dropped, and why

`vd3-docs` is the donor. It is a good donor: same stack, same package, a shell
proven across 102 pages. It is also two years of accumulated site-local code,
some of which the published `@vanduo-oss/vd3` has since absorbed. Copying it
verbatim would import three problems this repository's rules already forbid.

### Dropped: the live customizer

`overlays/LiveCustomizer.vue`, `src/customizer/`, `src/components/customizer/`,
and `stores/customizer.ts` are a playground for editing vd3 component props
live. `vd3-docs` documents those components; TypeScript School documents
TypeScript. Nothing on this site has a prop table to play with, so the whole
subsystem is out — along with its Pinia store, which `App.vue` would otherwise
have to initialise.

### Dropped: `docs.css`

The donor's shell is styled by `src/styles/docs.css`, 3,735 lines of
site-local CSS defining `.doc-nav-link`, `.global-search-modal`,
`.doc-sidebar-filter` and several hundred more. Porting it would violate the
house rule that `app.css` stays shell-and-layout-only and that component styling
belongs to the package.

Auditing the package's stylesheet against the donor's markup showed that most of
those classes already have a first-party equivalent: `vd-sidenav-nav`,
`vd-sidenav-section`, `vd-sidenav-item`, `vd-sidenav-link`, and
`vd-sidenav-divider` are all standalone list styles — only `.vd-sidenav` itself
is a fixed drawer — and `vd-doc-search-*` is a complete search-results contract.
So the shell is rebuilt on those, and `app.css` grows about 80 lines of flex and
grid, on vd3 tokens, and no component styling at all.

### Dropped: components the package now exports

`vd3-docs` hand-rolls `VdNavbar.vue`, `VdFooter.vue`, `VdBreadcrumb.vue`,
`VdThemeSwitcher.vue`, and `VdThemeCustomizer.vue` in its own `src/`. The
package exports all five. Two of the donor copies are actively wrong for this
repository:

- Its `VdBreadcrumb.vue` emits `.vd-breadcrumb-list` and `.vd-breadcrumb-sep`,
  neither of which exists in the package stylesheet — an invented API that would
  render unstyled.
- Its theme switcher and customizer duplicate components the package ships,
  including their focus management and keyboard handling, and would be a second
  writer of the same `data-theme` attributes.

So the site renders the package's `VdNavbar`, `VdFooter`, `VdBreadcrumb`,
`VdThemeSwitcher`, and `VdThemeCustomizer`, and the files under `src/layout/`
are thin site components that compose them with this site's brand, links, and
navigation data. That is less code, better accessibility, and the dogfooding the
house rules ask for.

### Renamed: no `Vd`-prefixed site components

Site components are `School*` — `SchoolNavbar`, `SchoolSidebar`,
`SchoolSidebarFilter`, `SchoolFooter`, `SchoolLayout`, `SchoolBrandMark`. The
donor names its site components `Vd*`, which was harmless when it did not import
the package's own `Vd*` components into the same files. Here they sit side by
side, and a `VdNavbar.vue` in `src/layout/` that is *not* the package's
`VdNavbar` is exactly the confusion this project's rules about invented APIs
exist to prevent.

`DocsLayout` becomes `SchoolLayout`, as the brief asks.

## The search modal, rebuilt

The donor's `GlobalSearchModal.vue` highlights the matched substring with
`v-html`, and escapes the surrounding text by assigning to `innerHTML` on a
detached element. Both are ESLint errors in this repository, and correctly so:
the whole project's posture is that user-influenced strings reach the DOM as
text nodes.

The rewrite splits a title into three plain strings — before, match, after — and
renders the middle one inside a `<mark>` element in the template. Same visual
result, no HTML string ever constructed, and the escaping question disappears
because nothing is ever parsed as HTML.

Structurally the modal is `VdModal` (which brings the backdrop, the focus trap,
Escape handling, and focus restoration) wrapping the package's
`vd-doc-search-*` markup contract. `app.css` contributes four rules that put the
results panel in the flow of the modal body instead of absolutely positioning it
under an input, which is how the class is designed for its in-page dropdown use.

The cmd+K and `/` shortcuts, the arrow-key cursor, and the grouped results are
ported from the donor's store, because that behaviour is good and the package's
`useDocSearch` is built for an inline combobox rather than a modal palette.

## Sidebar: a tier axis the donor did not have

The donor's sidebar has a two-way toggle between components and guides. The
derived tree here has three tier tabs, each holding one category per track, so
the sidebar gets a three-way segmented control instead.

The active tier follows the route: opening an intermediate lesson selects the
intermediate tab, so the surrounding lessons in view are the ones at the
reader's current level. Choosing a tab manually overrides that until the next
navigation. The filter is a substring match over the section title and its
keywords — and, because the derivation appends each lesson's summary to its
keywords, over the summary too, so filtering for "prototype pollution" finds the
lesson whose title says neither word.

`SchoolLayout` wraps only routes whose `meta.layout` is `"lesson"`. The home,
curriculum, and glossary pages are full width; a 201-item sidebar next to the
curriculum map would be the same information twice.

## The theme store

`stores/theme.ts` is ported in shape — a Pinia store with `init`, `setTheme`,
`setPrimary`, `setNeutral`, `setRadius`, `setFont`, `reset` — but not in
substance. The donor predates the package's `useThemePreference()` singleton and
owns preference state itself. Here the singleton is the single writer of the
`data-*` attributes and of `localStorage`, and the store is a thin site-policy
layer over it: it hydrates on mount and applies this site's per-mode neutral
default, following the mode while the neutral is still a default and getting out
of the way the moment the reader picks one explicitly.

Two writers of the same attributes would be a bug that only shows up when the
switcher and the customizer are open at once — which is exactly the combination
this site ships.

The primary colour is not the store's business: `main.ts` already registers
TypeScript blue in light and sky in dark through `VanduoVue`'s `themeDefaults`.

## Icons and fonts

The brief expected these to be missing, on the grounds that the scaffold did not
copy `vd3-docs/public/icons/` and `public/fonts/` across. They are not missing,
and copying them would have been the wrong fix.

`@vanduo-oss/vd3/css` resolves to `dist/vd3.min.css`, which already contains the
`@font-face` blocks and every `.ph-*` glyph rule for Phosphor regular and fill,
plus the eleven UI font families, with URLs relative to `dist/`. Vite rewrites
those URLs at build time and emits the files as hashed, same-origin assets —
which is what `font-src 'self'` requires and what a CDN would have violated. The
build already emits `Phosphor.woff2` and `Phosphor-Fill.woff2` alongside the
rest; verified in `dist/assets/`, and every icon name used in the curriculum is
checked against the `.ph-*` rules the stylesheet actually ships.

What `vd3-docs` copies into `public/` is the *six-weight* Phosphor set — bold,
light, thin, and duotone in addition to regular and fill — about 1.5 MB, loaded
through a stylesheet its `index.html` links directly. This site uses two weights,
so the extra 1 MB and the extra `<link>` buy nothing. Nothing was copied from
the reference clone's `public/`.

## Content Security Policy

The shell adds no inline script, no inline `<style>` element, no remote font,
and no network request. Everything it loads is a same-origin asset Vite emitted.
`main.ts` still leaves `initialState` empty, so vite-ssg still serialises
nothing — the theme is applied from `localStorage` on mount, and the search index
is computed from the curriculum at module load on both sides.
