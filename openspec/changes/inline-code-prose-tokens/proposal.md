## Why

Lesson and glossary prose often name TypeScript/JavaScript symbols, but those tokens render as plain text (or as literal backticks where authors already marked them up). Learners need MDN/Handbook-style monospace inline code so symbols stand out without inventing raw HTML in curriculum data.

## What Changes

- Add a shared curriculum-prose markdown → HTML helper (Labs `labsMarkdownToHtml`) and a `ProseHtml` component that renders it under `.ts-prose`
- Style `.ts-prose code` as monospace with a light pill background (vd tokens)
- Wire prose surfaces: LessonPage (summary, problem, insights, security body), DualPane/EditableTsPane captions, QuizBlock (prompt, choices, explanation), ExerciseBlock (prompt, hints), glossary definitions, curriculum map summaries
- Quiz choices: visible **A / B / C / D** letter prefixes in order; tasteful hover on option buttons using existing vd tokens (keep keyboard focus styles; letters available to screen readers)
- Sidebar curriculum lesson links: active + hover highlight boxes use the global vd radius token (match tier buttons / filter input; no sharp 90° corners)
- Fix already-backticked lesson strings so they render as `<code>` instead of literal backticks (~41 lesson modules; ignore generated diagnostics)
- Phase content migration: backtick TS/JS symbols editorially; leave English homographs plain; no auto-lexer. Prefer partial track coverage in this change if full migration does not fit
- Add unit tests for prose markdown XSS safety, component tests for `ProseHtml`, quiz letter assertions, and an e2e smoke that a known backticked lesson shows styled `<code>`

## Non-goals

- No auto-lexer or heuristic “symbol detection” in plain prose
- No raw HTML authored inside lesson/glossary data files
- No changes to notes sidebar / notes-draggable-modal (parallel OpenSpec work)
- No restyling of AI chat bubble markdown beyond existing behavior
- No full-curriculum backtick migration required in this change (phased OK)
- No purple/glow hover clichés; stay on vd3/app tokens

## Capabilities

### New Capabilities

- `inline-code-prose`: Curriculum prose renders Labs markdown backticks as styled inline `<code>`; XSS-safe pipeline; editorial backtick convention

### Modified Capabilities

- `lesson-engine`: Lesson prose fields and pane captions render through the prose HTML pipeline (source remains plain strings; display may use escaped HTML via the shared helper); quiz choices show letter prefixes and hover affordance; sidebar lesson link highlights respect global radius
- `e2e-coverage`: Smoke that a known backticked lesson surfaces inline `<code>`; quiz choices expose A/B/C/D

## Impact

- Routes unchanged; no lessons added/removed — display and content markup only
- Touches curriculum rendering components (especially `QuizBlock`), sidebar styles in `src/styles/app.css`, a small lib helper, selected lesson TS modules, vitest + Playwright tests
- Reuses `@vanduo-oss/vdl-engines/labs-md-to-html.js` (already used by chat/notes)
- Does not edit notes panel files unless a shared helper extraction is unavoidable (prefer a dedicated `prose-markdown` helper)
