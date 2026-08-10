## Context

See proposal.md for motivation. Today `Lesson` has `problem` (typically one
short sentence ~100 chars), dual panes, and `insight[]`, but no teaching
narrative between panes and takeaways. `LessonPage.vue` renders prerequisites
immediately after the problem. Prose goes through `ProseHtml` → Labs
markdown-lite (paragraphs, backticks → `<code>`, fenced blocks → `<pre><code>`).
A parallel commit (`c33e2eb`) partially migrated Variant A backticks across the
corpus; residuals (split generics like `` `Promise`<T> ``, mangled `infer`,
false English wraps of `never`/`any`) are fixed while rewriting prose.

Exercise `solution` (code string for Check) is unrelated to the new lesson
`solution` prose field — name collision is intentional in product language
("The solution") vs data (`lesson.solution` vs `lesson.exercise?.solution`).

## Goals / Non-Goals

**Goals:**

- Required `lesson.solution` prose + richer `problem` on every lesson
- Stable LessonPage order with Solution after panes and prerequisites at bottom
- Tests that lock schema, order, and e2e heading smoke
- Track-by-track content quality (not stubs)

**Non-Goals:**

- Changing dual-pane, diagnostics map, or exercise Check
- Touching Ask/jailbreak overlays or exercise action-icon CSS except section order
- Remote push

## Decisions

### D1 — `solution` is a single string (not string[] / structured blocks)

**Choice:** `solution: string`, same shape as `problem` / `summary` / security
`body`, rendered with `ProseHtml`.

**Why:** Consistent XSS posture (no raw HTML in curriculum data); Labs
markdown-lite already supports multi-paragraph and fenced snippets; authors
already know backticks. A structured `{ prose, snippets[] }` would duplicate dual
panes and invite HTML-ish fields.

**Alternatives:** `string[]` paragraphs (extra UI ceremony); structured blocks
with separate code fields (rejected — panes are the code).

### D2 — Dual panes stay the living example; solution explains them

**Choice:** Solution prose narrates how the TS pane fixes the JS failure;
optional short fences only when needed for a fragment not worth a full pane.

### D3 — Prerequisites placement: after references / exercise, before pager

**Choice:** "Bottom" = after all teaching + quiz/exercise + references, before
`ts-lesson-pager`. Mark-complete stays where it is (inside exercise actions or
standalone before pager).

**Why:** User asked for bottom, not mid-lesson; keeping prereqs before pager
preserves "what to read next / what you skipped" without interrupting the
problem→example→solution arc.

### D4 — Problem richness bar

**Choice:** Multi-sentence prose naming actors, the silent failure, and why JS
does not catch it. Prefer ≥ ~2 sentences / ~200+ characters as a soft authoring
bar; hard integrity gate is non-empty trim (same as today) plus a soft
minimum-length warning test or assert ≥ 120 chars to prevent one-liners
regressing — enforce a minimum of 160 characters in unit tests so "richer"
is measurable without being pedantic about exact wording.

### D5 — Solution richness bar

**Choice:** Same soft bar as problem (≥ 160 chars, non-empty). Explain what the
TS types/constructs do and what the diagnostic (if any) means — not a restatement
of takeaways alone.

### D6 — Migration order

**Choice:** Schema + LessonPage + tests first (temporary `solution: ""` will fail
tests, so add `solution` while migrating — or make field required and migrate
all tracks before green CI). Practical approach: add optional `solution?` briefly
is **rejected** — required from the start; migrate track-by-track with commits
after each track so types compile only when that track is done… Actually TypeScript
will fail on every lesson until all have `solution`. Options:

1. Add field as required and update all lessons in one big pass (types fail mid-way).
2. Add as required and use a codemod that inserts a placeholder then rewrite.
3. Temporarily `solution?: string` then tighten.

**Choice:** Required immediately; insert substantive content track-by-track. While
mid-migration, use a short bootstrap script that adds a TODO marker string only if
needed for typecheck — prefer writing real prose per track and committing when a
track is complete. For intermediate green builds during migration, a one-shot
script can set `solution` to a non-empty draft that the track pass replaces —
integrity min-length will force real content before marking the track done.

### D7 — Backtick residuals

While editing each lesson's prose fields, fix:

- Split generics: `` `Promise`<T> `` → `` `Promise<T>` ``
- Mangled nested `infer` strings
- English false wraps of `never` / `any` when the word is ordinary English

Leave Ask/jailbreak UI alone.

## Risks / Trade-offs

- [~201 lessons] → Mitigate with track-by-track commits and accurate tasks.md
- [Name clash `solution`] → Document in types JSDoc: lesson narrative vs exercise code
- [Longer pages] → Accept; presentation was the complaint
- [Visual baseline drift] → Update Playwright baselines if composition shifts screenshots
- [Parallel agents on Ask UI / exercise icons] → Do not edit those files unless
  LessonPage order requires it

## Migration Plan

1. OpenSpec artifacts (this change)
2. Types + LessonPage reorder + tests
3. Migrate foundations → … → testing (10 tracks), commit per track or per 2 tracks
4. Fix backtick residuals opportunistically
5. Validate openspec; leave tasks.md accurate if paused
6. Do not push

## Open Questions

None that block implementation — richness floor (160 chars) is a deliberate
measurable proxy and can be tuned later without changing specs.
