# curriculum-model Specification

## Purpose
The curriculum is the single source of truth for ts-school. This capability
defines what a lesson is, registers every lesson exactly once, derives the
navigation tree, the search-index source, and the route table from that
registry, and enforces by test that the prerequisite graph and the tier ladder
stay consistent.
## Requirements
### Requirement: every lesson carries a solution narrative

Every `Lesson` MUST include a required `solution` string: plain prose (Labs
markdown-lite / backticks allowed) that explains how the TypeScript side
addresses the failure mode named by `problem`. The field MUST NOT carry raw
HTML. Living code examples remain in `js` / `ts` panes; `solution` MAY reference
those panes in prose and MAY include short fenced code blocks when a fragment
outside the panes clarifies the narrative. Integrity tests MUST reject empty or
whitespace-only `solution` values.

#### Scenario: solution is required on the Lesson type

- **GIVEN** the exported `Lesson` interface
- **WHEN** an author omits `solution`
- **THEN** TypeScript reports a compile error

#### Scenario: empty solution fails integrity

- **GIVEN** a registered lesson whose `solution` is empty or whitespace-only
- **WHEN** the curriculum integrity suite runs
- **THEN** that lesson fails the suite

### Requirement: typed lesson model

`src/curriculum/types.ts` MUST define the lesson data model: `Tier`
(`"beginner" | "intermediate" | "advanced"`), `TrackId`, `LessonId`, `CodePane`
(`code`, `highlights`, `caption`), the TypeScript pane variant carrying
`expectedDiagnostics`, `QuizQuestion`, `Exercise`, `Reference`, `SecurityNote`,
`Track`, and `Lesson`. `Lesson` MUST include required prose fields `summary`,
`problem`, and `solution` (plain strings rendered through ProseHtml / Labs
markdown-lite — never raw HTML assigned to the DOM). Every code field
(`js.code`, `ts.code`, exercise starter/solution) SHALL be a plain string; the
model MUST NOT contain a field whose contents are rendered as unescaped HTML.
The module MUST import `ExpectedDiagnostic` from `@/typecheck/types` and MUST
NOT redefine it.

#### Scenario: a lesson author writes a stub

- **GIVEN** the exported `Lesson` interface
- **WHEN** an author declares a lesson with `id`, `title`, `tier`, `track`,
  `order`, `summary`, `prerequisites`, `keywords`, `problem`, `solution`, `js`,
  `ts`, and `insight`
- **THEN** it type-checks without a cast, and omitting any of those fields is a
  compile error

#### Scenario: the diagnostic contract has one definition

- **GIVEN** `src/typecheck/types.ts` and `src/curriculum/types.ts`
- **WHEN** the curriculum module's imports are inspected
- **THEN** `ExpectedDiagnostic` is imported from the typecheck module, so a
  change to the contract cannot leave the two sides disagreeing

#### Scenario: lesson code cannot carry markup

- **GIVEN** a lesson's `js` and `ts` panes
- **WHEN** they are rendered by any page
- **THEN** their `code` is a plain string placed in a text node, never assigned
  as HTML, because the model offers no HTML-bearing field to render


### Requirement: single registry of lessons

`src/curriculum/index.ts` MUST collect every lesson module into one registry,
sorted deterministically by track order, then tier, then lesson `order`. It
SHALL expose lookup by id, by track, and by tier, and SHALL be the only place
the application enumerates lessons.

#### Scenario: adding a lesson requires one registration

- **GIVEN** a new lesson module added to a track's index
- **WHEN** the application is built
- **THEN** the lesson appears in the registry, in the navigation tree, in the
  search index, and at its own route, with no other file edited

#### Scenario: lookup by id

- **GIVEN** the registry
- **WHEN** a known lesson id is looked up
- **THEN** the matching `Lesson` is returned, and an unknown id yields
  `undefined` rather than throwing

#### Scenario: enumeration order is stable

- **GIVEN** the registry
- **WHEN** the full lesson list is read twice in the same process or across
  processes
- **THEN** the order is identical, because it is derived from track order, tier,
  and lesson order rather than from module-import order

### Requirement: unique, URL-safe lesson ids

Every lesson id MUST be unique across the whole curriculum and MUST be a
lowercase kebab-case slug (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) so it can be used
verbatim as a URL segment.

#### Scenario: a duplicated id fails the build

- **GIVEN** two lessons that share an id
- **WHEN** the integrity suite runs
- **THEN** it fails and names the duplicated id

#### Scenario: an unsafe id fails the build

- **GIVEN** a lesson id containing an uppercase letter, a space, a slash, or a
  percent-encoded character
- **WHEN** the integrity suite runs
- **THEN** it fails, because the id would not survive being placed in a URL

### Requirement: acyclic prerequisite graph

The prerequisite relation across all lessons MUST form a directed acyclic graph.
The integrity suite SHALL prove acyclicity with a real topological sort that
consumes every lesson, and SHALL reject a lesson that lists itself.

#### Scenario: a cycle is detected

- **GIVEN** lessons A, B, and C where A requires B, B requires C, and C
  requires A
- **WHEN** the integrity suite runs
- **THEN** the topological sort cannot consume all three, and the test fails
  reporting the lessons left in the cycle

#### Scenario: a valid graph produces a full ordering

- **GIVEN** the registered curriculum
- **WHEN** the topological sort runs
- **THEN** it emits every lesson exactly once, so a study order that never
  presents a lesson before its prerequisites demonstrably exists

### Requirement: prerequisites resolve and respect the tier ladder

Every prerequisite MUST name a registered lesson, and a lesson MUST NOT depend
on a lesson of a higher tier than its own — a beginner lesson may require
beginner lessons, an intermediate lesson may require beginner or intermediate
lessons, and an advanced lesson may require any tier.

#### Scenario: a dangling prerequisite fails the build

- **GIVEN** a lesson listing a prerequisite id that no lesson exports
- **WHEN** the integrity suite runs
- **THEN** it fails and names both the lesson and the unresolved id

#### Scenario: an inverted dependency fails the build

- **GIVEN** a beginner lesson whose prerequisites include an advanced lesson
- **WHEN** the integrity suite runs
- **THEN** it fails, because the lesson is unreachable to the reader its tier
  promises it was written for

### Requirement: dense, tier-ordered sequence within a track

Within each track the `order` values MUST be exactly `1..n` with no gaps and no
duplicates, and tier MUST be non-decreasing as `order` increases, so a track
reads beginner-first and the sidebar can render it without re-sorting.

#### Scenario: a gap or duplicate fails the build

- **GIVEN** a track whose lesson orders are `1, 2, 2, 4`
- **WHEN** the integrity suite runs
- **THEN** it fails, naming the track and the offending sequence

#### Scenario: a tier regression fails the build

- **GIVEN** a track where an intermediate lesson is followed by a beginner
  lesson
- **WHEN** the integrity suite runs
- **THEN** it fails, because the track no longer reads in ascending difficulty

### Requirement: navigation tree derived from the registry

`src/nav.ts` MUST export a `NavTree` computed from the registry, using the
`NavTree` / `NavTab` / `NavCategory` / `NavSection` / `NavPage` shapes taken from
`vd3-docs`. Tabs SHALL be tiers, categories SHALL be tracks, and sections SHALL
be lessons in track order. The module MUST NOT contain a hand-written list of
lessons.

#### Scenario: every lesson is reachable from the tree

- **GIVEN** the registry and the derived tree
- **WHEN** every section of every category of every tab is collected
- **THEN** the set of section routes equals the set of lesson routes exactly —
  no lesson is missing and no section points at a lesson that does not exist

#### Scenario: the ported shell consumes the tree unchanged

- **GIVEN** a sidebar or search component written against the `vd3-docs`
  `NavTree` shape
- **WHEN** it reads the derived tree
- **THEN** it finds the same field names and nesting, so it needs no adaptation

#### Scenario: an empty tier or track is omitted

- **GIVEN** a tier with no lessons, or a track with no lessons at some tier
- **WHEN** the tree is derived
- **THEN** no empty tab or empty category is emitted

### Requirement: routes derived from the registry

`buildRoutes()` MUST return one static route per registered lesson at
`/lessons/<track>/<lesson-id>`, spliced ahead of the `/:pathMatch(.*)*`
catch-all, each carrying the lesson's title and description in `meta` and its id
in `props`. The route table MUST NOT be hand-maintained.

#### Scenario: every lesson has a resolvable route

- **GIVEN** the router built from `buildRoutes()`
- **WHEN** each lesson's route path is resolved
- **THEN** the resolution succeeds and yields the lesson route rather than the
  not-found catch-all

#### Scenario: the catch-all stays last

- **GIVEN** the derived route table
- **WHEN** its final record is inspected
- **THEN** it is the `/:pathMatch(.*)*` catch-all, so no lesson route is
  swallowed

#### Scenario: the application bootstrap is unchanged

- **GIVEN** `src/main.ts` as the scaffold left it
- **WHEN** lesson routes are added
- **THEN** no edit to `main.ts` is required, because `buildRoutes()` is still
  the single route source it consumes

### Requirement: one placeholder route component for every lesson

A single `src/pages/LessonPage.vue` MUST render any lesson, resolving it from
the registry by the id supplied on the route. Until the lesson engine lands it
SHALL render the lesson's title, tier, track, and summary, and SHALL be marked
in the source as a placeholder to be replaced.

#### Scenario: a lesson route renders its metadata

- **GIVEN** a registered lesson
- **WHEN** its route is rendered
- **THEN** the page shows the lesson's title, its tier, its track, and its
  summary

#### Scenario: an unwritten lesson body is honest about it

- **GIVEN** a lesson whose code panes are placeholders
- **WHEN** its page is rendered
- **THEN** it states that the lesson body is not written yet rather than
  displaying placeholder code as if it were content

#### Scenario: the lesson engine drops in without touching routing

- **GIVEN** a later change that implements the dual-pane engine
- **WHEN** it replaces the body of `LessonPage.vue`
- **THEN** the route table, the registry, and the navigation tree need no edit

### Requirement: placeholder panes are distinguishable from content

`src/curriculum/placeholder.ts` MUST produce the code panes a stubbed lesson
carries and MUST export a predicate that reports whether a pane is still a
placeholder, so that pages and the future compiler-truth suite can treat
unwritten lessons differently from written ones.

#### Scenario: the compiler-truth suite skips unwritten lessons

- **GIVEN** a curriculum in which most lessons are still stubs
- **WHEN** a later change runs the real compiler over every lesson
- **THEN** it can skip placeholders and check only authored panes, so unwritten
  content does not fail the build

#### Scenario: an authored pane is no longer skipped

- **GIVEN** a lesson whose `ts` pane has been replaced with real code
- **WHEN** the predicate is applied
- **THEN** it reports the pane as authored, so the pane is checked from that
  moment on

