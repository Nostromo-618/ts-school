# curriculum-taxonomy Specification

## Purpose
The complete inventory of what TypeScript School teaches: every topic across ten
tracks, placed on a defensible beginner-to-advanced ladder, with a glossary of
the vocabulary and two pages that render the whole thing. This is the backbone
the content changes fill in — a topic missing here is missing from the product.
## Requirements
### Requirement: ten tracks covering the subject

The curriculum MUST be organised into the ten tracks the project charter names:
foundations; primitives, literals, unions and narrowing; functions and generics;
interfaces against type aliases, classes and modules; type-level programming;
the runtime boundary; async, errors and `Result`; Node.js migration; tooling and
the strictness ladder; and testing with types. Every track SHALL carry a title,
an icon, a curriculum position, and a description, and every track SHALL contain
at least one lesson.

#### Scenario: the curriculum map shows every track

- **GIVEN** the `/curriculum` page
- **WHEN** it is rendered with no filter applied
- **THEN** all ten tracks appear, in curriculum order, each with its lesson
  count

#### Scenario: no track is declared but empty

- **GIVEN** the registered tracks
- **WHEN** each is asked for its lessons
- **THEN** none returns an empty list, so the navigation never renders a heading
  with nothing under it

### Requirement: taxonomy weighted for a Node.js audience

The taxonomy MUST reflect that the intended reader is a working Node.js
JavaScript developer. The Node.js migration track SHALL cover, at minimum,
adding TypeScript to an existing project, `allowJs`/`checkJs`, obtaining types
for dependencies, `node:` builtins, running TypeScript under Node, CommonJS to
ESM, module interop, `package.json` exports and the `types` condition,
environment variables, CLI arguments, `fs` and `path`, streams, HTTP servers,
event emitters, child processes and buffers, global augmentation, publishing
types, shimming untyped dependencies, and migrating a large codebase. The
runtime boundary SHALL be a track of its own rather than a section of another.

#### Scenario: a Node developer finds their own problem

- **GIVEN** a reader searching for `process.env`, `streams`, `CommonJS`, or
  `__dirname`
- **WHEN** the search index built from the curriculum is queried
- **THEN** a lesson dedicated to that topic is returned

#### Scenario: untrusted input is treated as a first-class subject

- **GIVEN** the track list
- **WHEN** the runtime boundary track is inspected
- **THEN** it contains distinct lessons for `unknown` against `any`,
  `JSON.parse`, type assertions, type guards, assertion functions, schema
  validation, and prototype-pollution-aware inspection of untrusted objects

### Requirement: every lesson carries its placement metadata

Every lesson MUST declare `tier`, `track`, `order`, `prerequisites`, `keywords`,
`summary`, and a one-line `problem` statement before any content is written, and
MUST satisfy the `Lesson` type in full. Code panes MAY be placeholders, and when
they are, they SHALL be marked as such so that pages and the compiler-truth
suite can distinguish them from authored content.

#### Scenario: a stub is still a complete lesson

- **GIVEN** a lesson whose prose has not been written
- **WHEN** the project is type-checked
- **THEN** it compiles as a `Lesson` with no cast and no optional-field
  workaround, and its route, nav entry, and search entry all exist

#### Scenario: a content author has nothing to invent

- **GIVEN** a later change authoring a tier's content
- **WHEN** its author opens a lesson file
- **THEN** the id, title, tier, track, order, prerequisites, keywords, summary,
  and problem statement are already decided, so authoring adds prose without
  changing the taxonomy

### Requirement: a defensible tier ladder

Tier assignment MUST express what the reader is assumed to know already:
beginner lessons SHALL introduce notation for programs the reader can already
write in JavaScript, intermediate lessons SHALL change how the reader models
their program, and advanced lessons SHALL be about the checker's own behaviour.
The rationale for the assignment, and for every contested call, SHALL be
recorded in the change's design document.

#### Scenario: the ladder is enforced, not merely asserted

- **GIVEN** the complete taxonomy
- **WHEN** the integrity suite runs
- **THEN** no lesson depends on a lesson of a higher tier, and tier never
  decreases as `order` increases within a track

#### Scenario: an empty tier is left empty

- **GIVEN** a track with no lesson that a beginner could act on
- **WHEN** the taxonomy is authored
- **THEN** that track has no beginner lesson, and the derived navigation omits
  the category from the beginner tab rather than showing an empty group

#### Scenario: the same subject appears at two depths

- **GIVEN** a subject with both an intuition and a rule set — structural typing,
  narrowing, generic inference, compiler performance
- **WHEN** the taxonomy is read
- **THEN** the intuition is a lower-tier lesson and the rule set is a
  higher-tier lesson that lists it as a prerequisite

### Requirement: one file per lesson

Each lesson MUST live in its own module under
`src/curriculum/lessons/<track>/<id>.ts`, and each track MUST register its
lessons through an index that lists them explicitly rather than discovering them
by glob.

#### Scenario: tier-authoring changes run in parallel

- **GIVEN** three changes authoring the beginner, intermediate, and advanced
  tiers at the same time
- **WHEN** each edits the lessons of its own tier
- **THEN** no two of them modify the same file

#### Scenario: an unregistered lesson file is visible

- **GIVEN** a lesson module added to a track directory but not to its index
- **WHEN** the track index is reviewed
- **THEN** its absence is apparent, because registration is an explicit import
  rather than an implicit glob

### Requirement: glossary of the vocabulary

`src/curriculum/glossary.ts` MUST define the terms TypeScript's error messages
and documentation assume. Each term SHALL carry a unique anchor-safe id, a
plain-text definition, the tier at which a reader first needs it, optional
search aliases, and at least one link to a lesson that teaches it. Every link
MUST resolve to a registered lesson, and a term's first linked lesson MUST NOT
be of a higher tier than the term.

#### Scenario: a renamed lesson breaks the build

- **GIVEN** a glossary term linking to a lesson id
- **WHEN** that lesson is renamed without updating the glossary
- **THEN** the glossary test fails, naming the term and the unresolved id

#### Scenario: a beginner filters the glossary

- **GIVEN** a reader filtering the glossary to the beginner tier
- **WHEN** they follow the first link on any visible term
- **THEN** they arrive at a lesson at or below their own tier

### Requirement: the curriculum map page

`/curriculum` MUST render the whole inventory grouped by track, showing each
lesson's tier badge, title, and summary, with per-track and per-tier counts and
a tier filter. It SHALL leave an explicit seam for the progress meters a later
change adds, and SHALL be complete in the prerendered HTML before any JavaScript
runs.

#### Scenario: the map is readable without JavaScript

- **GIVEN** the prerendered `/curriculum` page
- **WHEN** it is viewed with scripting disabled
- **THEN** every track and every lesson is present and every lesson title is a
  working link

#### Scenario: filtering to a tier hides empty tracks

- **GIVEN** the map filtered to a single tier
- **WHEN** a track has no lesson at that tier
- **THEN** the track is omitted rather than rendered with an empty list

#### Scenario: progress meters drop in without restructuring

- **GIVEN** a later change adding per-track progress
- **WHEN** it renders a progress meter at the marked seam
- **THEN** the page's loop, filter, and layout need no modification

### Requirement: the glossary page

`/glossary` MUST render every term with its tier badge and definition, filterable
by free text across term, definition, and aliases, and by tier. Each entry SHALL
link to its related lessons and SHALL be addressable by its own anchor.

#### Scenario: a reader looks up a word from an error message

- **GIVEN** the glossary page
- **WHEN** the reader types part of a term or of its definition
- **THEN** only matching entries remain, and the visible count is reported

#### Scenario: a term is linkable

- **GIVEN** a term's id
- **WHEN** it is used as a URL fragment on `/glossary`
- **THEN** the browser scrolls to that term's entry

#### Scenario: the unfiltered glossary is prerendered

- **GIVEN** the built `/glossary` page
- **WHEN** it is served as static HTML
- **THEN** every term is already in the markup, because the filters default to
  showing everything

