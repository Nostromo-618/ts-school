## Why

Lesson pages jump from a thin one-line "The problem" straight into dual panes and
takeaways, with "Read these first" interrupting near the top. Learners never get
a dedicated narrative that explains how TypeScript solves the failure mode — the
presentation feels weak (reported on `private, protected, and #private` and
applies globally).

## What Changes

- **BREAKING (curriculum model)**: add a required `solution` prose field on
  every `Lesson` (plain string; ProseHtml / Labs markdown-lite with backticks;
  dual panes remain the living code example — no raw HTML, no new XSS surface).
- Expand every lesson's `problem` into a richer multi-sentence illustration of
  the failure mode (still ProseHtml-safe prose; optional short fenced snippets
  only when dual panes alone cannot name the failure).
- Reorder `LessonPage.vue`: title / meta / summary → problem → dual panes →
  **solution** → takeaways / security / diagram → quiz → exercise → references →
  **prerequisites ("Read these first") just before the pager** (bottom of the
  teaching surface).
- Integrity tests: every lesson has non-empty `solution` and a substantive
  `problem`; unit coverage for schema + render order; e2e smoke that the
  Solution heading appears.
- Content pass over all ~201 lessons track-by-track (real prose, not stubs),
  incorporating the in-flight Variant A backtick migration and fixing residuals
  (split generics, mangled `infer`, false `never`/`any` wraps) as lessons are
  edited.
- OpenSpec deltas for `curriculum-model`, `lesson-engine`,
  `curriculum-taxonomy`, and `e2e-coverage`.

## Non-goals

- Changing dual-pane / diagnostics / exercise Check behavior
- Restoring live in-browser typechecking
- Editing Ask / jailbreak red UI overlays or exercise button-icon work by
  parallel agents (except LessonPage section order if required)
- Pushing to remote
- Redesigning quiz/exercise UX beyond page order

## Capabilities

### New Capabilities

_(none — presentation is an extension of the existing lesson model and engine)_

### Modified Capabilities

- `curriculum-model`: `Lesson` gains required `solution`; `problem` remains
  required but is no longer constrained to a single line.
- `lesson-engine`: page composition order includes Solution after dual panes;
  prerequisites move to the bottom (before pager).
- `curriculum-taxonomy`: placement metadata and authoring expectations include
  `solution`; problem may be multi-paragraph.
- `e2e-coverage`: smoke that Solution heading renders on a lesson page.

## Impact

- `src/curriculum/types.ts`, every lesson under `src/curriculum/lessons/**`,
  `src/pages/LessonPage.vue`, curriculum integrity unit tests, Playwright e2e.
- Routes unchanged (same lesson URLs).
- Specs under `openspec/specs/{curriculum-model,lesson-engine,curriculum-taxonomy,e2e-coverage}`.
