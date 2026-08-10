## Context

Lesson prose is plain strings in `src/curriculum/lessons/**/*.ts` and glossary
definitions, today interpolated with `{{ }}` so markdown backticks show as
literal characters. Chat and notes already use
`@vanduo-oss/vdl-engines/labs-md-to-html.js`. See proposal.md for motivation.
Parallel OpenSpec work on `notes-draggable-modal` owns notes panel files —
keep this change in curriculum rendering, quiz UI, and shell CSS.

## Goals / Non-Goals

**Goals:**

- Shared escaped markdown → HTML path + `ProseHtml` for curriculum prose
- MDN-style `.ts-prose code` pill styling on vd tokens
- Wire all listed prose surfaces; fix already-backticked lessons
- Quiz A/B/C/D labels + token-based hover; sidebar link radius alignment
- Unit / component / e2e coverage for renderer safety and visible code/letters

**Non-Goals:**

- Auto-lexer; raw HTML in lesson data; notes modal work; full-curriculum
  backtick migration (phased content OK)

## Decisions

1. **Dedicated `renderProseHtml` helper** (not notes/chat helpers)  
   Rationale: curriculum prose should not inherit chat linkify or notes
   fence-language concerns. Reuses `labsMarkdownToHtml` only.  
   Alternative considered: reuse `renderNotesHtml` — rejected to avoid coupling
   to notes sidebar work.

2. **`ProseHtml` Vue component wrapping `v-html`** under `.ts-prose`  
   Rationale: one eslint-disable site; callers stay declarative. Outer element
   is a `div` (or `span` with `inline` prop) because Labs wraps paragraphs in
   `<p>` — avoid nesting `<p>` inside `<p>`.  
   Alternative: composable only — worse for consistent class/CSS.

3. **CSS `.ts-prose code` pill** using `--vd-font-mono`, subtle
   `--vd-bg-secondary` / `color-mix` background, `--vd-radius-sm`, tight
   padding — match Handbook/MDN, not AI-bubble bare mono.

4. **Quiz letters in the template** (`A` + index), not in curriculum data  
   Rationale: order is UI concern; keeps choice `id`/`text` unchanged for
   progress scoring. Include letter in accessible name (visible span, not
   `aria-hidden`).

5. **Hover via existing border/background tokens** on `.ts-quiz-choice:hover`  
   Soft secondary background / border shift; preserve `:focus-visible` outline.
   No purple glow.

6. **Sidebar radius override in `app.css`**  
   `.ts-sidebar-nav .vd-sidenav-link { border-radius: var(--vd-radius-md); }`
   (same family as buttons/inputs). Package sidenav has no radius; app-level
   override is allowed for shell chrome. Do not invent a custom px radius.

7. **Content migration**  
   Priority: engine + CSS + wiring + tests; fix ~41 already-backticked lesson
   files (they already author correctly once wired); then backtick a partial
   track (prefer foundations or types) as time allows.

## Risks / Trade-offs

- [Nested paragraph / caption layout] → Use block vs inline ProseHtml variants;
  strip or avoid extra wrappers in caption rows.
- [VdAlert slot HTML] → Prefer ProseHtml as default slot child; verify slot
  accepts element children.
- [Quiz e2e selectors] → Letter prefixes change accessible names; update
  Playwright matchers to include `A.` / letter + text.
- [Partial content] → Document migration status; remaining bare tokens are OK.

## Migration Plan

1. Ship renderer, CSS, wiring, quiz letters/hover, sidebar radius, tests.
2. Already-backticked files “just work”; add further backticks opportunistically.
3. Rollback: revert change; curriculum strings with backticks remain valid plain
   text if HTML path is removed.

## Open Questions

None — Variant A, quiz lettering, and sidebar radius are locked.
