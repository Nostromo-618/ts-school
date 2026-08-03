# Tasks

## 1. Taxonomy design

- [x] 1.1 Decide the ten tracks' order and scope for a Node.js JavaScript
      audience, weighting the Node.js migration and runtime-boundary tracks
      accordingly.
- [x] 1.2 Enumerate every topic per track and assign a tier, recording the rule
      each tier encodes and every contested call in `design.md`.
- [x] 1.3 Draw the prerequisite graph, keeping every edge within or below the
      dependent lesson's tier.

## 2. Lesson stubs

- [x] 2.1 Author the `types` track (24 lessons).
- [x] 2.2 Author the `functions` track (21 lessons).
- [x] 2.3 Author the `structures` track (24 lessons).
- [x] 2.4 Author the `type-level` track (21 lessons; no beginner tier, by
      design).
- [x] 2.5 Author the `runtime-boundary` track (19 lessons).
- [x] 2.6 Author the `async` track (16 lessons).
- [x] 2.7 Author the `node-migration` track (24 lessons).
- [x] 2.8 Author the `tooling` track (22 lessons).
- [x] 2.9 Author the `testing` track (13 lessons).
- [x] 2.10 Register all ten tracks in `src/curriculum/index.ts`.

## 3. Glossary

- [x] 3.1 Author `src/curriculum/glossary.ts`: 87 terms with tier, plain-text
      definition, aliases, and related lessons.
- [x] 3.2 Author `tests/unit/glossary.spec.ts`: unique anchor-safe ids,
      non-empty definitions, valid tiers, every related lesson resolves, a
      term's first lesson is not above its tier, alphabetical render order.

## 4. Pages

- [x] 4.1 Author `src/pages/curriculum.vue`: grouped by track, tier badges,
      tier filter, per-track and per-tier counts, and a commented seam for
      `VdProgress`.
- [x] 4.2 Author `src/pages/glossary.vue`: text and tier filters, tier badges,
      per-term anchors, links into the curriculum.
- [x] 4.3 Add `/curriculum` and `/glossary` to `buildRoutes()`.
- [x] 4.4 Extend `src/styles/app.css` with flex/grid page-layout primitives on
      vd3 tokens. Badges, buttons, cards, and breadcrumbs use the package's own
      classes and appear nowhere in this file.

## 5. Verification

- [x] 5.1 Derived nav/search verification (house rule for any lesson change):
      the existing suite asserts nav section routes equal registry lesson
      routes, now over 201 lessons.
- [x] 5.2 Fix every tier-ladder violation the integrity suite reports. Nine
      were found; each was resolved by moving the lesson or choosing an honest
      prerequisite, and all nine are recorded in `design.md`.
- [x] 5.3 `pnpm lint`, `pnpm stylelint`, and `pnpm typecheck` pass.
- [x] 5.4 `pnpm test` passes — 122 assertions across 11 files.
- [x] 5.5 `pnpm build` prerenders 204 pages: home, `/curriculum`, `/glossary`,
      and 201 lessons.
- [x] 5.6 Compiler-truth suite: not applicable. Every code pane is still a
      marked placeholder and no lesson claims a diagnostic, so there is nothing
      for the compiler to contradict. It becomes required the moment
      `author-beginner-tier` writes the first pane.
- [x] 5.7 `openspec validate add-full-taxonomy --strict` passes.
