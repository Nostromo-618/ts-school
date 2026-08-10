## Context

See proposal.md for motivation. Today the site already persists learner progress (`ts-school-progress`), ToC (`ts-school-toc-accepted`), AI risk (`ts-school-ai-risk-accepted`), AI pin (`ts-school-ai-chat-pinned`), and vd3 theme prefs (`vanduo-theme-preference` plus related `vanduo-*` keys). AI chat is a right-dockable overlay (`TsAiChatSidebar` + `aiChat` store) with CSP-safe assistant markdown via Labs `labsMarkdownToHtml`. There is no Profile page, no notes surface, and `buildSchoolChatContext` has no progress summary.

## Goals / Non-Goals

**Goals:**
- Local Profile + notes + dual dock without accounts.
- Single export/clear hygiene surface with honest limits on model cache deletion.
- Progress-aware AI context/tools without inventing curriculum.
- Critical-path tests under existing `pnpm gate:release`.

**Non-Goals:**
- IndexedDB notes (unless localStorage quota forces a follow-up).
- Guaranteed wipe of every browser/OS cache for LiteRT.
- Changing AI default model.
- Server-backed notes or sync.

## Decisions

1. **Route & nav** — Add `/profile` as a standalone page in `nav.PAGES` + `buildRoutes()` so vite-ssg prerenders it. Navbar uses a user/profile Phosphor icon in `SchoolNavbar` actions (not inside the collapsible menu). Profile is not listed as a primary marketing nav link unless we also add a text link; icon-only in actions is enough, with accessible `aria-label`.

2. **Notes storage** — Versioned JSON in `localStorage` key `ts-school-notes` (schema v1: `{ version, body, updatedAt }`). Debounced writes. Pin state: `ts-school-notes-pinned` (`0`/`1`) and `ts-school-notes-pin-side` (`left`|`right`, default `right`). Prefer localStorage over IndexedDB for simplicity and parity with progress; revisit only if quota errors appear in testing.

3. **Clear-all scope (locked)** — Confirm via `VdModal`. Clears:
   - `ts-school-progress`
   - `ts-school-notes` (+ notes pin keys)
   - `ts-school-ai-chat-pinned` + in-memory `aiChat` open/pending state
   - `ts-school-toc-accepted` and ToC declined session key
   - `ts-school-ai-risk-accepted`
   - Best-effort vd3 keys: `vanduo-theme-preference`, `vanduo-palette`, `vanduo-primary-color`, `vanduo-neutral-color`, `vanduo-radius`, `vanduo-font-preference`
   - Best-effort `caches.keys()` / `cache.delete`, and `indexedDB.databases()` + `deleteDatabase` when available, targeting known LiteRT / model cache names discovered at implementation time (document unknowns in Profile copy)
   - **Cannot reliably clear from JS:** HTTP disk cache for previously fetched `.litertlm`, some private/incognito restrictions, OPFS if used by runtime without enumeration, Service Workers not registered by the app (site currently has none — note if that changes)

4. **Export envelope** — Download `typescript-school-export-YYYYMMDD.json` shaped as:
   ```json
   {
     "exportVersion": 1,
     "exportedAt": "<iso>",
     "progress": null | ProgressV1,
     "notes": null | NotesV1,
     "preferences": { "...school and readable theme keys..." }
   }
   ```
   Import is out of scope for this change (export-only).

5. **Notes UI** — `TsNotesSidebar` mirror of AI sidebar chrome (vd3 buttons/icons). Edit = textarea; Preview = escaped markdown. Prefer reusing Labs markdown (`labsMarkdownToHtml`) plus a small notes renderer that post-processes `<pre><code class="language-ts">` into `VdCodeSnippet` / cbun highlighter if CSP-safe; fallback: highlighted static HTML from a dependency already bundled (no CDN). Do not use raw `v-html` with unescaped model input — same bar as AI chat.

6. **Dual dock CSS** — Extend `app.css` with `--ts-notes-sidebar-width` and shell classes `is-notes-pinned-left` / `is-notes-pinned-right` (and keep `is-ai-chat-pinned`). When both AI (right) and notes (left) pin, apply both insets. If notes pin right while AI also pinned right, notes take precedence on the right *or* stack — **locked default:** notes pin side XOR; if notes chooses right while AI is pinned, AI remains pinned but both share the right dock by stacking width (notes + AI) *or* simpler: **when notes pins right, temporarily treat AI as overlay-only (unpin visual dock)**. Prefer simpler UX: **AI dock stays right-only; notes may pin left or right; if both claim right, add combined right inset = sum of widths** (both visible). Document in UI that left is recommended when AI is pinned.

7. **LLM progress** — Extend `buildSchoolChatContext` with `learnerProgress: { completedCount, inProgressCount, byTrack: [...], recentLessonIds: [...] }` from the progress store + registry. Add tool `get_learner_progress`. Append policy: learning-plan advice must use registry + progress; suggest next incomplete lessons in track order / primer when empty. Add `profile` to `schoolLocationKind`. Works on Profile with chat pinned.

8. **Naming** — `ts-` / `School*` / `Ts*` for site overlays; dogfood vd3 (`VdModal`, `VdProgress`, `VdButton`, icons). No `Vd*` wrappers that shadow package components.

9. **Testing** — Vitest: notes parse/hydrate, clear/export helpers, `buildSchoolChatContext` progress, tool executor. Playwright: profile nav, notes persist, pin sides, export download, clear confirm/cancel, AI risk re-prompt after clear. Axe + visual for `/profile`. No real LLM download in CI.

## Risks / Trade-offs

- [Dual right dock complexity] → Prefer summed right inset; recommend pinning notes left when AI is open; e2e at desktop width.
- [Incomplete model cache clear] → Honest Profile copy + best-effort APIs; never claim “disk wiped.”
- [localStorage quota for long notes] → Debounce + soft size warning (~100KB); IndexedDB deferred.
- [Markdown highlighter CSP] → Only bundled highlighters; reuse AI/chat or cbun paths.
- [Clearing ToC/AI risk] → Intentional “factory reset”; confirm modal copy lists consents.
- [Visual baseline churn] → Update snapshots in same change.

## Migration Plan

1. Land stores + Profile page + navbar icons (no notes dock yet if needed for incremental PR — but OpenSpec treats as one change).
2. Notes sidebar + CSS docks.
3. Export/clear hygiene + AI context/tool.
4. Tests, axe, visuals, `pnpm gate:release`.
5. Archive OpenSpec change after implementation complete.

## Open Questions

- Exact LiteRT Cache Storage / IndexedDB database names (discover during implementation from `@litert-lm/core` / runtime; document on Profile).
- Whether Profile should appear in the text nav link row (default: actions icon only to avoid crowding).
