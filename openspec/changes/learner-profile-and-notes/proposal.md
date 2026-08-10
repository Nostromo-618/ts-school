## Why

Learners already accumulate local progress, preferences, AI consent, and (soon) notes in the browser, but there is no single place to review that data, export or wipe it, or take learning notes beside lessons. The lesson AI also cannot see progress, so it cannot ground a learning-plan suggestion in what the learner has already finished.

## What Changes

- **Route added:** prerendered `/profile` (Profile page) — not a lesson; same ToC gate as other pages.
- **Navbar:** profile icon (right-side actions) linking to `/profile`; notes toggle (sibling to Ask) opening a pinable notes sidebar.
- **Profile page:** learning progress summary (from existing `ts-school-progress`), inventory of local browser data keys/stores, export-all JSON download, clear-notes, and clear-all with confirm modal (progress, notes, prefs, AI pin/UI, best-effort model caches).
- **Notes sidebar:** separate from AI chat; both may be open; pin left XOR right; plain text + markdown preview with safe rendering and TS-friendly fenced-code highlighting under CSP.
- **LLM awareness:** extend `buildSchoolChatContext` / school tools with a progress summary and `get_learner_progress`; policy for learning-plan advice grounded in registry + progress (no invented lessons).
- **Tests / gates:** unit + Playwright critical paths; axe/visual coverage for `/profile` and notes overlay; remains under `pnpm gate:release`.
- **Routes/lessons removed:** none. **Lessons changed:** none.

## Non-goals

- Accounts, server sync, auth, or cloud backup.
- Changing default AI model selection or flipping E2B/E4B defaults.
- Shipping model weights in git or guaranteeing complete LiteRT/Cache Storage wipe on every browser.
- Replacing the curriculum sidebar with notes, or merging notes into AI chat history.
- Live `tsc` / code execution in notes or chat.
- Forking `@vanduo-oss/vd3` / `vd3-cbun`.

## Capabilities

### New Capabilities

- `learner-profile`: Profile route/UI, local-data inventory, export-all, clear-all (with confirm), clear notes; progress summary for humans and for AI context hooks.
- `learner-notes`: Versioned local notes store, pinable left/right notes sidebar, markdown + highlighted code fences under CSP.

### Modified Capabilities

- `docs-shell`: Navbar profile control and notes control; shell layout must support AI dock and notes dock without breaking curriculum sidebar.
- `learner-features`: Progress remains localStorage-only; Profile and export/clear consume the same validated progress schema (no parallel progress store).
- `e2e-coverage`: Critical-path e2e/a11y/visual coverage for Profile, notes sidebar, export/clear, and progress-aware AI context smoke (stubbed).
- `ai-risk-disclaimer`: Clear-all interaction with AI risk acceptance MUST be specified (cleared vs retained — see design default).

## Impact

- `SchoolNavbar.vue`, `App.vue`, `src/styles/app.css` (dual dock), `src/nav.ts` / router pages list, new `src/pages/profile.vue`.
- New Pinia stores: notes (+ maybe profile/data-hygiene helpers); reuse `progress`, `aiChat`, theme preference APIs.
- `src/ai/school-tools.ts` (+ unit tests): context + `get_learner_progress` tool + policy line.
- Storage keys: add `ts-school-notes`, `ts-school-notes-pinned` (and side); inventory existing keys documented on Profile.
- Playwright fixtures, axe list, visual baselines; `gate:release` unchanged in composition unless new e2e files are picked up automatically.
