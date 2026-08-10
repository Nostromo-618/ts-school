## 1. Prose pipeline

- [x] 1.1 Add `src/lib/prose-markdown.ts` with `renderProseHtml` via `labsMarkdownToHtml` (escape-only; no chat linkify)
- [x] 1.2 Add `src/components/ProseHtml.vue` (`.ts-prose`, `v-html`, block/inline variants)
- [x] 1.3 Style `.ts-prose` / `.ts-prose code` in `src/styles/app.css` (mono + light pill, vd tokens)

## 2. Wire prose surfaces

- [x] 2.1 Wire LessonPage: summary, problem, insights, security body
- [x] 2.2 Wire DualPane + EditableTsPane captions
- [x] 2.3 Wire QuizBlock prompt, choice text, explanation via ProseHtml
- [x] 2.4 Wire ExerciseBlock prompt + hints
- [x] 2.5 Wire glossary definitions + curriculum map lesson summaries

## 3. Quiz letters and hover

- [x] 3.1 Prefix choices A/B/C/D… in QuizBlock (visible + in accessible name)
- [x] 3.2 Add tasteful `:hover` styles on `.ts-quiz-choice` using vd tokens; keep `:focus-visible`

## 4. Sidebar radius

- [x] 4.1 Apply global `--vd-radius-md` (or equivalent site radius token) to `.ts-sidebar-nav .vd-sidenav-link` active/hover highlights

## 5. Content

- [x] 5.1 Verify already-backticked lesson modules render (no content change required beyond wiring)
- [x] 5.2 Add backticks for TS/JS symbols on at least one track (or as many bare tokens as reasonable); leave English homographs plain

## 6. Tests

- [x] 6.1 Unit: prose-markdown XSS + backtick → `<code>`
- [x] 6.2 Unit/component: ProseHtml + QuizBlock letter prefixes A–D
- [x] 6.3 E2e: known backticked lesson shows `<code>`; update quiz selectors for letter prefixes

## 7. Verify and commit

- [x] 7.1 Run focused unit tests (and e2e smoke if practical)
- [x] 7.2 Local commit (do not push)
