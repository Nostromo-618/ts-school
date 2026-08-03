# Design — the taxonomy and its tier ladder

## Who this is for, and what that changes

The reader is a working Node.js developer who ships JavaScript. They know
closures, promises, `require`, streams, and how to debug a production incident.
They do not know what "not assignable" means, why `unknown` exists, or which of
the eight `strict` flags is worth the migration.

Two consequences run through the whole taxonomy:

- **Node.js migration is a first-class track, not an appendix.** It is the
  second-largest track (24 lessons) and the only one whose lessons are named
  after files the reader already has open: `fs`, `streams`, `process.env`,
  `package.json`. A curriculum aimed at this reader that treats Node as a
  footnote is aimed at someone else.
- **The runtime boundary gets its own track (19 lessons) rather than a chapter
  in "types".** A server developer's dangerous input is not a mis-typed variable,
  it is a request body. `JSON.parse` returning `any` deserves to be a named
  lesson with a route, not a paragraph.

Nothing assumes prior experience of a nominal type system. `structural-typing`
is a beginner lesson in `foundations` precisely because the reader has *no*
competing model to unlearn — and `implements-vs-extends` exists to catch the
ones who do.

## Track order

Tracks are ordered for a reader working straight down the list:

1. **Foundations** — why, what `tsc` does, how to read what it says back.
2. **Types & narrowing** — the type system's vocabulary.
3. **Functions & generics** — the first abstraction.
4. **Objects, classes & modules** — structuring a codebase.
5. **Type-level programming** — computing types from types.
6. **The runtime boundary** — where the guarantees stop.
7. **Async, errors & Result** — the failure model.
8. **Node.js migration** — applying all of it to a real service.
9. **Tooling & the strictness ladder** — enforcing it.
10. **Testing with types** — proving it stays enforced.

Node migration sits at 8 rather than 1 despite being the destination. Renaming a
file is a bad first lesson: the errors it produces are about narrowing, unions,
and callbacks, and the reader cannot act on any of them yet. `foundations`
carries the two migration-shaped topics that *are* safe on day one —
`typing-javascript-with-jsdoc` and `erasable-syntax-and-type-stripping` — so a
reader gets value before track 8.

## The tier ladder

| Track | Beginner | Intermediate | Advanced | Total |
| --- | ---: | ---: | ---: | ---: |
| Foundations | 12 | 3 | 2 | 17 |
| Types & narrowing | 11 | 9 | 4 | 24 |
| Functions & generics | 5 | 10 | 6 | 21 |
| Objects, classes & modules | 9 | 11 | 4 | 24 |
| Type-level programming | 0 | 9 | 12 | 21 |
| The runtime boundary | 5 | 8 | 6 | 19 |
| Async, errors & Result | 3 | 10 | 3 | 16 |
| Node.js migration | 7 | 12 | 5 | 24 |
| Tooling & strictness | 4 | 12 | 6 | 22 |
| Testing with types | 2 | 7 | 4 | 13 |
| **Total** | **58** | **91** | **52** | **201** |

### The rule each tier encodes

**Beginner — you can already write this in JavaScript; here is how to say it in
TypeScript.** A beginner lesson introduces no new *program*, only new notation
for something the reader already writes: annotating a parameter, describing an
object, checking for `null`. The test is whether the lesson can be understood by
someone who has installed TypeScript this morning and has not yet met generics.
That is why `union-types`, `literal-types`, and `narrowing-with-typeof` are
beginner — they describe control flow the reader writes daily — while
`discriminated-unions` is not: it asks the reader to *change their data model*.

**Intermediate — you now write TypeScript that a JavaScript developer would not
have written.** These lessons change the code, not just its annotations: tagged
unions instead of optional fields, `Result` instead of `throw`, a parsed config
object instead of forty reads of `process.env`. This is the largest tier (91 of
201) on purpose. It is where the working developer spends their career, and a
curriculum that rushes from "what is a union" to "distributive conditional
types" has skipped the part that pays.

**Advanced — you are reasoning about the checker itself.** Variance, inference
internals, assignability, declaration emit, recursive conditional types,
compiler performance. The marker is that the lesson's subject is TypeScript's
behaviour rather than the reader's program. `control-flow-analysis` is advanced
even though narrowing is beginner, because the lesson is about the algorithm.

### Where the ladder was contested, and how it was decided

These were the genuinely arguable calls. Each was settled by asking what the
reader must already know, and the answer was then written into the prerequisite
graph, where a test enforces it.

- **`type-level` has no beginner lessons at all.** Deliberate. There is no
  version of `keyof` that is useful to someone who has not yet met object types
  and generics. Leaving the tier empty is more honest than manufacturing an
  introductory lesson to fill a cell, and the derived nav simply omits the
  category from the beginner tab.
- **`enums-vs-literal-unions` is beginner.** `enum` is the feature that looks
  most familiar to an arriving developer and behaves least as they expect, so
  the warning has to come before they have written forty of them — not after.
- **`void-returning-callbacks` moved from beginner to intermediate.** It reads
  like a beginner gotcha (`forEach(async …)`), but explaining it requires
  `void` and `never` as types, which is intermediate. Rather than teach the rule
  as a superstition, it waits for the vocabulary that makes it a consequence.
  Same reasoning promoted `awaited-and-unwrapping` and
  `assertions-and-narrowing-in-tests`.
- **`promise-types` stayed beginner despite being generic.** Reading `Promise<T>`
  is not writing a generic, and a Node developer meets it on their first day.
  Its prerequisites are `function-type-expressions` and `object-type-literals`,
  not `generics-intro`.
- **`structural-typing` is beginner; `assignability-rules` is advanced.** The
  same subject at two depths: the first is the intuition, the last is the rule
  set. This split repeats deliberately — `narrowing-with-typeof` /
  `control-flow-analysis`, `generics-intro` / `generic-inference-internals`,
  `type-level-performance` / `type-checking-performance`.
- **`typing-request-handlers` is intermediate, not advanced.** It is where most
  real vulnerabilities live, and putting it behind an advanced gate would mean
  most readers never reach it. Its dependency on `typing-http-servers` is
  intermediate too, so the ladder holds.
- **The `strict` flags are intermediate, not beginner.** `strict-mode` in
  `foundations` (beginner) explains that the umbrella exists; the individual
  flags in `tooling` are intermediate because each is a migration decision with
  a cost, not a checkbox.

### The mechanical guarantee

Tier is not just a label. `tests/unit/curriculum.spec.ts` enforces that no
lesson depends on a lesson of a higher tier, so every claim above is checked on
every run. Writing the taxonomy surfaced nine violations of that rule, each of
which was a genuine mistake — either a tier that was too optimistic or a
prerequisite that was reaching too far — and each was resolved by moving the
lesson or by choosing an honest prerequisite. That is the rule earning its keep
before a line of content exists.

The suite also enforces that tier never decreases along a track, so every track
reads beginner-first top to bottom, and that `order` is dense, so there is no
ambiguity about where a new lesson goes.

## One file per lesson

`src/curriculum/lessons/<track>/<id>.ts`, each exporting one `Lesson`, with an
explicit `index.ts` per track. 211 files is a lot for stubs, and it is still the
right layout, for one reason: `author-beginner-tier`, `author-intermediate-tier`,
and `author-advanced-tier` are three changes that can run at the same time. With
a file per track they would all edit the same ten files; with a file per lesson
they never touch the same file at all.

The track `index.ts` lists its imports explicitly rather than using
`import.meta.glob`. A glob would make a lesson file appear in the build without
anyone registering it, and — worse — make an unregistered file look registered
during review. The explicit list is the registration.

## Glossary

87 terms, each carrying the tier at which a reader first *needs* the word, which
is not always the tier of the lesson that teaches it in depth — "assignability"
is advanced, but a beginner meets the word in their first error message, so the
term links first to `assignability-rules` and the definition is written to be
useful before that lesson is read.

Every term links to at least one lesson, and the links are checked: a renamed
lesson fails `tests/unit/glossary.spec.ts` rather than producing a dead entry.
The suite also enforces that a term's *first* related lesson is not above the
term's own tier, so a reader filtering the glossary to "beginner" is never sent
straight into an advanced lesson.

Terms are plain text with no markup, matching the rule that holds across the
lesson pipeline.

## The two pages

`/curriculum` is the transpose of the sidebar. The nav tree groups by tier and
then track, because that is the reading order; the map groups by track and shows
every tier at once, because that is the mental model of the subject. The tier
filter reconciles the two. Track cards render with the package's `vd-card` and
`VdBadge`; the only site CSS is flex layout for the rows.

The progress seam is a comment in the track header, positioned so that
`add-learner-features` adds a `VdProgress` element and changes nothing else on
the page — not the loop, not the filter, not the layout.

`/glossary` filters on term, definition, and aliases at once, and defaults to
showing everything so the prerendered page is complete without JavaScript. Both
pages are fully meaningful before hydration, which is the whole point of
prerendering them.
