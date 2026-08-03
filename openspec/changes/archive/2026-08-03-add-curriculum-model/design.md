# Design — curriculum model

## The inversion

`vd3-docs` keeps three parallel lists of the same 102 pages: the imports and
route records in `router.ts`, the `NavTree` literal in `nav.ts`, and — via the
search store's `buildIndex(nav)` — the search index. Two of the three are
hand-maintained. Nothing detects a page that exists in `router.ts` but was
forgotten in `nav.ts`; it simply becomes unreachable.

ts-school has one list. `src/curriculum/` holds typed `Lesson` modules;
`src/nav.ts` computes a `NavTree` from them; `src/router.ts` computes route
records from them; the search store indexes the computed `NavTree`. Adding a
lesson is a one-file operation, and the integrity suite fails if the derivations
stop agreeing.

The `NavTree` shape is copied verbatim from `vd3-docs/src/nav.ts`
(`NavTree` → `NavTab[]` → `NavCategory[]` → `NavSection[]`, plus flat
`NavPage[]`). That is deliberate: the ported sidebar, sidebar filter, and search
store are then a straight port with no adaptation to their data access. Only the
producer changes.

## Why tabs are tiers and categories are tracks

The tree has exactly one two-level slot to spend, and the curriculum has two
axes: ten tracks and three tiers.

Tiers as tabs wins because tier is the pacing decision this site is built
around. A learner who opens the sidebar wants "what should I read next at my
level", and a tier tab answers that across all ten tracks — the recommended path
is *read the beginner tier, then the intermediate tier*, not *finish
type-level programming before touching Node migration*. It also keeps the tree
proportioned like the one the ported components were written for: three tabs of
about ten categories each, rather than ten tabs of three.

The track axis is not lost. The registry exposes `lessonsByTrack`, the
`/curriculum` map page (next change) is grouped by track, and
`lessonNeighbours()` walks a track in order so the lesson engine's prev/next
follows a track rather than a tier. The sidebar selects the tab matching the
current lesson's tier, so a reader stays oriented without choosing an axis.

## Lesson ids are globally unique, routes are namespaced

`LessonId` is a plain `string` alias rather than a branded type. Branding would
make every lesson file need a cast or a constructor, which is a poor trade for
data that a test already validates: ids are asserted unique and URL-safe
(`^[a-z0-9]+(?:-[a-z0-9]+)*$`) in `curriculum.spec.ts`.

Routes are `/lessons/<track>/<lesson-id>`. The track segment is redundant given
globally unique ids, and it is there anyway: it makes a URL self-describing,
lets a reader lop off a segment to reach the track, and leaves room for a future
`/lessons/<track>` index page without a route collision. Every route is static,
so `vite-ssg` prerenders all of them; a `/lessons/:track/:id` dynamic route
would prerender none.

## Prerequisites: a DAG, checked as one

`prerequisites` is a `LessonId[]`, and four properties are enforced by test:

1. Every prerequisite id resolves to a registered lesson.
2. The graph is acyclic — proved by a real topological sort (Kahn's algorithm)
   that must consume every node, not by a depth-limited walk.
3. No lesson depends on a lesson of a *higher* tier. A beginner lesson whose
   prerequisite is advanced is a pacing bug: it is unreachable to the reader it
   was written for.
4. A lesson does not list itself.

Rule 3 is the one that would otherwise rot silently. Tier is a promise to the
reader about what they need to know already, and the prerequisite graph is the
only machine-checkable statement of that promise.

`order` is checked to be dense (`1..n` with no gaps or duplicates) within each
track, and tier is checked to be non-decreasing along that order — a track reads
beginner-first, and the sidebar can render it top to bottom without sorting
again.

## Placeholder panes

Every lesson satisfies the full `Lesson` type from the moment it is stubbed, so
the registry, nav, routes, and integrity suite are exercised against real data
long before any prose is written. `src/curriculum/placeholder.ts` produces the
`js` and `ts` panes with a `TODO(content)` marker line, and exports
`isPlaceholder(pane)`.

That predicate is the seam the follow-on agents need:

- `LessonPage.vue` (and the dual-pane engine that replaces it) renders an
  honest "not written yet" state instead of a pane of TODO text.
- The compiler-truth suite in `add-lesson-engine` skips placeholders rather than
  failing the build for every unwritten lesson, and the moment a pane stops
  being a placeholder it is checked like any other.

A stubbed `ts` pane carries `expectedDiagnostics: []`, which is both truthful
(placeholder code produces no diagnostics) and the correct starting point.

## `ExpectedDiagnostic` is imported, not redefined

`src/typecheck/types.ts` owns the diagnostic contract, and both sides depend on
it rather than on each other: the worker produces `TsDiagnostic`, lessons author
`ExpectedDiagnostic`, and the compiler-truth suite asserts the second predicts
the first. Redefining a structurally identical interface in
`src/curriculum/types.ts` would compile and then drift. The import direction
(curriculum → typecheck types) is safe because that module has no imports of its
own.

## One route component for every lesson

`LessonPage.vue` takes a `lessonId` prop supplied as a static `props` object on
the route record, looks the lesson up in the registry, and renders it. All
seventeen routes — and eventually all of them — point at the same component.

The version in this change renders title, tier badge, track, summary, problem
statement, and prerequisite links, and says plainly that the lesson body is not
written yet. It is marked in a file-level comment as the placeholder
`add-lesson-engine` replaces. That agent changes the component's body and
nothing else: not the route table, not the registry, not the nav.
