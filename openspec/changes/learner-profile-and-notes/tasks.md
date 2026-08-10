## 1. Storage and hygiene helpers

- [x] 1.1 Add versioned notes store (`ts-school-notes`) with parse/hydrate/persist/clear and unit tests
- [x] 1.2 Add notes pin store keys (`ts-school-notes-pinned`, `ts-school-notes-pin-side`) with hydrate + unit tests
- [x] 1.3 Implement export-all JSON builder (progress + notes + school/theme preference snapshots) and unit tests
- [x] 1.4 Implement clear-all helper: school keys, vd3 theme keys (best-effort), aiChat UI reset, Cache Storage / IndexedDB best-effort; document non-clearable surfaces for Profile copy
- [x] 1.5 Discover and record LiteRT/model cache database or cache names used at runtime (comment + Profile inventory copy)

## 2. Profile page and navbar

- [x] 2.1 Add `/profile` to `nav.PAGES` and router so vite-ssg prerenders it; verify derived search index includes Profile after regenerate if applicable
- [x] 2.2 Build `src/pages/profile.vue`: progress summary (reuse progress store + `VdProgress`), local data inventory, export, clear notes, clear-all confirm (`VdModal`)
- [x] 2.3 Add profile icon control to `SchoolNavbar` actions (outside collapsible menu) linking to `/profile`
- [x] 2.4 Wire Profile hydrate of progress/notes on client mount; ensure ToC gate behavior unchanged

## 3. Notes sidebar and dual dock

- [x] 3.1 Implement `TsNotesSidebar` (edit textarea + markdown preview) with CSP-safe Labs markdown pipeline and TS fence highlighting via bundled/cbun path
- [x] 3.2 Mount notes sidebar from `App.vue`; navbar notes toggle via custom event (mirror Ask)
- [x] 3.3 Implement pin left XOR right + CSS dock classes in `app.css` (independent of AI dock; combined right inset when both claim right)
- [x] 3.4 Unit or component test: adversarial markdown in notes preview is inert

## 4. LLM progress awareness

- [x] 4.1 Extend `buildSchoolChatContext` / `composeSchoolSystemExtra` with compact `learnerProgress` summary from progress store + registry
- [x] 4.2 Add `get_learner_progress` to `SCHOOL_TOOL_DEFS` + executor; extend `schoolLocationKind` for `/profile`
- [x] 4.3 Add learning-plan policy lines (registry + progress only; no invented lessons)
- [x] 4.4 Unit tests for context + tool with seeded progress

## 5. Tests and release gate

- [x] 5.1 Playwright: profile via navbar; progress summary with seeded storage; notes persist across reload; pin left/right at desktop
- [x] 5.2 Playwright: export download contains progress/notes; clear-all confirm wipes; cancel preserves; Ask after clear-all shows AI risk modal
- [x] 5.3 Add `/profile` (+ notes-open if practical) to axe smoke; update Chromium Desktop visual baseline for `/profile`
- [x] 5.4 Run `pnpm build` (prerender includes `/profile`) and `pnpm gate:release`; fix failures (no lesson content changes → no diagnostics regenerate / compiler-truth required unless accidentally touched)
