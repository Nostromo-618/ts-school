## Why

`add-curriculum-model` built the machinery and proved it against one track.
The remaining nine tracks are not detail work: the taxonomy *is* the product's
backbone, and anything missing from it will be missing from the finished site,
because the content agents write against this list and nothing else.

The tier assignment is the other half. This site's promise is a defensible
ramp from a working Node.js JavaScript developer to someone who can read the
checker's mind, and that ramp only exists if each lesson's tier is a considered
claim about what the reader already knows. Deciding tiers lesson by lesson while
writing prose would produce a ladder nobody planned; deciding them all at once,
against a prerequisite graph a test can check, produces one that holds.

## What Changes

- Add 184 lesson stubs across the nine remaining tracks, one typed `Lesson` per
  file under `src/curriculum/lessons/<track>/`, each with tier, order,
  prerequisites, keywords, summary, and a one-line problem statement, and
  placeholder code panes. With `foundations` the curriculum is 201 lessons:
  58 beginner, 91 intermediate, 52 advanced.
- Register all ten tracks in `src/curriculum/index.ts`.
- Add `src/curriculum/glossary.ts`: 87 terms, each with the tier it starts
  mattering at, a plain-text definition, search aliases, and links to the
  lessons that teach it.
- Add `src/pages/curriculum.vue` — the full map grouped by track, with tier
  badges, a tier filter, per-track counts, and a marked seam where
  `add-learner-features` will render `VdProgress`.
- Add `src/pages/glossary.vue` — every term with its tier badge, filterable by
  text and by tier, each entry linking into the curriculum.
- Modify `src/router.ts`: add `/curriculum` and `/glossary`.
- Add `tests/unit/glossary.spec.ts` and extend the existing integrity suite's
  reach — it now runs over 201 lessons instead of 17.
- Extend `src/styles/app.css` with page-layout primitives (flex and grid on vd3
  tokens) for the two new pages. No component styling.

Routes added: `/curriculum`, `/glossary`, and 184 lesson routes. None changed or
removed.

## Non-goals

- **NO lesson content.** Every `js` and `ts` pane is still a marked placeholder,
  every `insight` array is empty, and no lesson claims a diagnostic. The three
  `author-*-tier` changes own the prose, and the compiler-truth suite has
  nothing to check until they do.
- **NO quizzes, exercises, or diagrams.** Those fields stay absent; the model
  already types them.
- **NO progress meters.** `curriculum.vue` leaves a commented seam and renders
  no `VdProgress`; `add-learner-features` owns the store and the meter.
- **NO lesson engine.** `LessonPage.vue` is still the placeholder from
  `add-curriculum-model`.
- **NO docs shell.** Both new pages render inside whatever `App.vue` currently
  provides; `port-docs-shell` wraps them.
- **NO history or about pages.** `add-supporting-pages` owns those.
- **NO Playwright specs.**

## Capabilities

### New Capabilities

- `curriculum-taxonomy`: the complete inventory of topics, the tier assignment
  and prerequisite graph that pace them, the glossary, and the two pages that
  render the whole thing.

### Modified Capabilities

- `curriculum-model`: no requirement changes. The nine new tracks exercise the
  registry, the derived nav tree, and the integrity suite at full scale — 201
  lessons rather than 17 — which is what that capability was specified for.

## Impact

- Route count rises from 20 to 204; `vite-ssg` prerenders all of them.
- `src/curriculum/lessons/` gains 193 files. One file per lesson is what lets
  the three tier-authoring changes run in parallel without touching the same
  file, which is the reason for the layout.
- Fixes the surface the content agents write against: they add prose to an
  existing file, and never invent an id, a tier, an order, or a prerequisite.
- Fixes the interface `add-learner-features` needs: `lessonCounts()`,
  `lessonsByTrack()`, and the marked seam in `curriculum.vue`.
