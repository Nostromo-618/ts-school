## Context

Home, curriculum, glossary, lesson routes, and not-found already ship. Charts
CSS is imported in `main.ts`. Standalone pages live in the hand-written
`PAGES` array inside `src/nav.ts` (the only non-derived part of the tree);
`SchoolNavbar` filters out `/` and renders the rest. A sibling agent owns the
lesson engine — shared edits to `src/router.ts` / `src/nav.ts` must be
re-read-before-write merges. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**

- Dogfood `useTimeline` + package timeline classes, and `VdLineChart` /
  `VdBarChart`, with data isolated in `src/data/`.
- Keep pages SSG-safe: timeline markup prerenders; charts mount in
  `onMounted` (already how the package wrapper works).
- Wire routes into nav, search, and footer without inventing a second nav
  source.

**Non-Goals:**

- No real adoption dataset acquisition beyond clear "illustrative" labelling
  (or short cited footnotes if a public figure is used).
- No changes to lesson routes, progress, or typecheck worker.
- No Playwright specs in this change.

## Decisions

### 1. Data module: `src/data/history.ts`

Milestone objects (`year`, `title`, `body`, optional `tone` for
`vd-timeline-*` variants) and chart row arrays live in one typed module.
Keeps the page SFC presentational. Alternative considered: inline in the
Vue file — rejected so unit tests can assert milestone coverage and chart
labelling without mounting Vue.

### 2. Timeline markup + `useTimeline`

Render an `<ol class="vd-timeline vd-timeline-animated">` of
`.vd-timeline-item` children with `.vd-timeline-marker`,
`.vd-timeline-date`, `.vd-timeline-title`, `.vd-timeline-text` — the classes
the package CSS and `useTimeline` already wire. Call `useTimeline(rootRef)`
from the page script. Prefer scroll-reveal (animated) over playback
controls for a long reading timeline. Alternative: invent a custom
vertical list — rejected (house rule: dogfood real APIs).

### 3. Charts are illustrative by default

Without a licence-clean longitudinal npm/GitHub dataset at hand, both
series are labelled **illustrative** in visible copy and in chart `title` /
`description` props. Shape the numbers to teach the qualitative story
(JS everywhere → Node server → TS adoption rising) without claiming
measurement. Alternative: omit charts — rejected; the plan requires them.

### 4. Shared-file merge discipline

Before editing `src/router.ts`, `src/nav.ts`, or `SchoolFooter.vue`,
re-read from disk. Only append history/about route blocks and PAGES
entries; do not rewrite lesson-route generation the sibling may be
touching for meta only.

### 5. Not-found polish

Keep the existing centred 404; add a secondary link to `/curriculum` and
import `RouterLink` explicitly for clarity (template-only usage relies on
vue-router's global registration today).

### 6. About content

Short sections: promise (paired panes + real tsc), audience (Node JS
devs), stack (vd3 / vite-ssg), and the TS 6 vs 7 teaching note. Link to
`/history` and `/curriculum`. No cards in the hero; match home/glossary
page rhythm (`ts-page`, `ts-lead`, `vd-stack`).

## Risks / Trade-offs

- **[Risk] Sibling merge conflict on `router.ts`** → Mitigation: additive
  route pushes only; re-read immediately before write.
- **[Risk] Readers treat illustrative charts as fact** → Mitigation:
  visible "illustrative" label beside each chart heading, plus chart
  accessibility title/description.
- **[Risk] Search-store test hard-codes `+ 3` standalone pages** →
  Mitigation: update to `+ 5` (or derive from `nav.pages.length`) in the
  same change.
- **[Trade-off] Illustrative data vs delayed real citations** → Prefer
  shipping labelled illustrative charts now; citations can replace numbers
  later without API changes.

## Migration Plan

Additive only. No data migration. Rollback = delete the two pages, data
module, and route/nav/footer entries.

## Open Questions

None — illustrative labelling resolves the data-source ambiguity without
blocking implementation.
