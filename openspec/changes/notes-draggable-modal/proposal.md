## Why

The pinned left/right notes sidebar fights the lesson layout and Ask AI dock: dual insets, edge stacking, and pin-side choreography make notes feel like chrome to manage rather than a scratchpad. Learners need notes that float over content, stay out of the way when folded, and remember where they put them — without reserving permanent dock space.

## What Changes

- **BREAKING (UX):** Replace the docked notes sidebar (`TsNotesSidebar` pin-left / pin-right / shell insets) with a floating notes **modal window** that can be opened, closed, dragged, resized, and folded independently of Ask AI.
- Persist window geometry (position + size) and fold state under school-owned `ts-school-*` localStorage keys; migrate or retire `ts-school-notes-pinned` and `ts-school-notes-pin-side`.
- Keep existing entry points (navbar Notes control / `ts:open-notes`) and note body persistence (`ts-school-notes` schema v1), edit/preview, and Profile clear/export inventory updates for the new preference keys.
- On narrow viewports, use a sensible near-full-screen sheet fallback instead of free drag when pointer drag is awkward.
- Update shell CSS so notes no longer participate in dual-dock insets; Ask AI docking behavior stays as today.
- Expand unit + Playwright coverage for open/close, drag, resize, fold, persistence, and AI coexistence.

## Non-goals

- No change to note body schema (`NotesV1`), markdown preview CSP pipeline, or soft size warning.
- Notes remain local-only and are still **not** injected into AI chat context.
- No new keyboard global shortcut for notes (navbar remains the primary open path).
- No import of notes; Profile export/clear semantics stay export-only / confirm clear-all.
- Ask AI sidebar UX (pin, auto-reopen, right-only dock) is out of scope except coexistence rules with the notes modal.
- No visual redesign of lesson pages beyond removing notes dock insets.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `learner-notes`: Replace pinable left/right sidebar requirements with floating modal behaviors (drag, resize, fold, open/close, persistence, a11y, mobile fallback); keep store/body/preview/navbar open requirements where still valid.
- `docs-shell`: Remove notes from dual-dock inset requirements; dual dock becomes AI-only (or AI + future docks), with notes as an overlay window that MUST NOT permanently inset main content.
- `learner-profile`: Inventory, export preferences, and clear-all MUST cover the new notes window preference keys instead of (or in addition to migrating away from) pin/pin-side keys.
- `e2e-coverage`: Replace pin left/right critical-path assertions with floating-modal coverage (open/close, persist geometry/fold, coexistence with Ask when relevant); keep profile/notes body persist and axe notes-open smoke.

## Impact

- **UI:** `src/overlays/TsNotesSidebar.vue` (likely rename/refactor to a notes modal), `src/App.vue` shell class wiring, `src/styles/app.css` dock variables / `is-notes-pinned-*` rules.
- **State:** `src/stores/notes.ts` — drop or migrate pin/pinSide; add position, size, folded (and possibly open-session policy); hydrate clamping.
- **Hygiene:** `src/lib/data-hygiene.ts`, `src/lib/vd3-theme-storage.ts` protected keys, Profile page inventory labels.
- **Tests:** `tests/unit/notes-store.spec.ts`, `tests/unit/data-hygiene.spec.ts`, `tests/e2e/profile-notes.spec.ts`, axe notes-open path; new unit coverage for geometry clamp/migrate; Playwright drag/resize/fold.
- **Routes/lessons:** None added, changed, or removed — shell overlay only on existing routes.
- **Deps:** Prefer pointer events + CSS; avoid heavy drag libraries unless a tiny dependency is clearly justified in design.
