## Context

Today notes are a docked overlay (`TsNotesSidebar.vue` + `useNotesStore`) with `pinned` / `pinSide` (`left` | `right`), shell classes `is-notes-pinned-left|right`, and CSS dock insets that interact with Ask AI’s right dock (`--ts-notes-dock-*`, dual-right stacking). Body persistence (`ts-school-notes` / `NotesV1`) and edit/preview stay. See `proposal.md` for motivation. Canonical behavior targets: delta specs under this change for `learner-notes`, `docs-shell`, `learner-profile`, and `e2e-coverage`.

Constraints: static vite-ssg site, strict CSP, no new runtime network, localStorage-only for notes prefs, vd3 for component chrome, layout geometry in `app.css` only.

## Goals / Non-Goals

**Goals:**

- Replace dock chrome with a floating notes window: drag, resize, fold, open/close.
- Persist geometry + fold; clamp to viewport; migrate off pin keys.
- Keep Ask AI dock independent; notes never add permanent content insets.
- Sheet fallback below a free-move breakpoint; keyboard-reachable close/fold; testable unit + Playwright coverage.

**Non-Goals:**

- Redesigning Ask AI pin/auto-reopen.
- Keyboard arrow-key fine positioning of the window (optional later).
- Changing `NotesV1` or markdown CSP pipeline.
- Adding a global notes hotkey.
- New npm drag libraries unless pointer-events approach proves unmaintainable during apply (default: no new dependency).

## Decisions

### D1 — Floating modal, not docked sidebar

- **Choice:** Notes become a positioned overlay window (`position: fixed`) with title bar, body, resize handle(s). Remove pin L/R controls and shell dock classes for notes.
- **Why:** Matches product ask; eliminates dual-dock complexity and pin-side tips.
- **Alternatives:** Keep dock + add float mode (rejected — two paradigms); always-sheet drawer (rejected — loses desktop scratchpad placement).

### D2 — Component shape

- **Choice:** Refactor `TsNotesSidebar.vue` into a notes modal component (prefer rename to `TsNotesModal.vue` or keep filename temporarily with clear `data-testid` updates). Mount from `App.vue` as today. Use `role="dialog"` (or `complementary`) with accessible name “Notes”; prefer non-modal dialog pattern (no focus trap that blocks lesson reading) unless a11y review requires modal trapping while expanded — **default: non-modal dialog** so learners can keep typing in the lesson while notes stay open.
- **Why:** Notes are a scratchpad beside content, not a blocking modal.
- **Alternatives:** Strict modal with focus trap (rejected as default — fights lesson workflow).

### D3 — Store & persistence keys

- **Choice:**
  - Keep: `ts-school-notes` (`NotesV1`), session `open` (still **do not** auto-open on hydrate).
  - Add: `ts-school-notes-window` — JSON `{ version: 1, x, y, width, height }` (CSS px, viewport-relative top-left of window).
  - Add: `ts-school-notes-folded` — `"1"` / `"0"`.
  - Remove after migrate: `ts-school-notes-pinned`, `ts-school-notes-pin-side`.
- **Defaults (first open / missing geometry):** width ≈ current sidebar (`22rem` → px at runtime), height ≈ `min(70vh, 32rem)`, position bottom-right-ish with margin so it does not fully cover Ask if Ask is open (simple offset from viewport edges; no live collision solver).
- **Min size:** ~ `280×200` CSS px (tune in apply if editor chrome needs more).
- **Why:** Separate keys keep body schema untouched and match existing pin key style; versioned window payload allows future fields.
- **Alternatives:** Stuff geometry into `NotesV1` (rejected — mixes content and chrome); single prefs blob for all school UI (out of scope).

### D4 — Migration from pin prefs

- **Choice:** On hydrate, if legacy pin keys exist and no `ts-school-notes-window` yet: seed default `x` from former side (`left` → left margin, `right` → right-aligned default). Then **delete** legacy pin keys. Ignore `pinned` for open state (open remains session-only; closing no longer needs to “unpin”).
- **Why:** Soft continuity without resurrecting dock behavior.
- **Alternatives:** Hard ignore legacy (also fine; seeding is nicer). Never delete legacy (rejected — inventory noise).

### D5 — Drag / resize implementation

- **Choice:** Pointer Events on title-bar drag handle and a bottom-right (or edge) resize handle; update store on `pointerup` (and optionally throttle `pointermove` writes). Re-clamp on `window.resize`. No new dependency.
- **Why:** Small surface area, CSP-safe, easy to unit-test clamp helpers.
- **Alternatives:** CSS `resize` only (poor position control); third-party library (bundle + a11y unknown).

### D6 — Fold

- **Choice:** Fold collapses to title bar height; body unmounted or `hidden`; persist immediately. Unfold restores previous height from geometry (height in storage is expanded height).
- **Why:** Matches “title bar only” product language.
- **Alternatives:** Minimize to corner chip (more novel chrome; defer).

### D7 — Mobile / narrow fallback

- **Choice:** Free-move breakpoint aligned with existing dock breakpoint **`48rem`**. Below it: near-full-viewport sheet (fixed inset with small margin), disable free drag/resize (or ignore), keep fold/close/edit/preview.
- **Why:** Drag on small screens is awkward; matches prior “full-width overlay” spirit without dock insets.
- **Alternatives:** Always allow drag on mobile (rejected); bottom sheet library (unnecessary).

### D8 — Coexistence with Ask AI

- **Choice:** Both may be open; z-index keep Ask (`40`) above notes (`39`) or bump notes slightly if title bar becomes unreachable — prefer **notes z-index above Ask when notes were most recently focused/opened**, but keep implementation simple: **notes at 41, Ask at 40** so the scratchpad stays reachable when both open (product default). No mutual exclusion. No content inset for notes.
- **Why:** Dual-right stacking goes away; stacking order is the only interaction.
- **Alternatives:** Keep Ask always on top (risk: notes trapped under Ask on the right).

### D9 — Profile / hygiene

- **Choice:** Update `data-hygiene` inventory, export preferences, clear-all, and `VD3_SITE_PREFIX_PROTECTED_KEYS` for new keys; drop required pin keys.
- **Why:** Spec parity with learner-profile delta.

### D10 — Testing strategy

- **Unit:** Pure helpers for parse/clamp/migrate window geometry; store persist round-trip for window + fold; hygiene key coverage; markdown tests unchanged.
- **Playwright:** Extend `profile-notes.spec.ts` (and/or dedicated notes-modal spec): open/close, body persist, drag + reload, resize + reload, fold + reload, Ask+notes open, mobile sheet open; update axe notes-open selector/testid; remove pin-left/right assertions.
- **Why:** Specs demand observable persistence and coexistence.

## Risks / Trade-offs

- **[Risk] Non-modal dialog confuses a11y auditors expecting focus trap** → Mitigation: document pattern; ensure Escape closes if focus is inside notes (optional but recommended); axe smoke on notes-open.
- **[Risk] Geometry in px breaks across DPR / window sizes** → Mitigation: clamp on every open and resize; accept approximate restore.
- **[Risk] Playwright drag flakiness** → Mitigation: use `page.mouse` with large deltas; assert storage keys and bounding box ranges, not pixel-perfect.
- **[Risk] Learners lose muscle memory for pin** → Mitigation: one-time position seed from pin side; no dock equivalent (accepted product break).
- **[Trade-off] Notes above Ask in z-order** → Scratchpad reachable; Ask may sit under notes until Ask is focused — acceptable for this change.

## Migration Plan

1. Ship code that reads new keys, seeds from legacy pin side when needed, deletes legacy pin keys on hydrate, stops writing pin keys.
2. Remove notes dock CSS and App shell classes in the same change (no multi-release dual support required — local-only app, no deploy fleet).
3. Rollback: revert change; legacy pin keys already deleted for users who opened the new build — they fall back to default pin side on old code (acceptable for private local app).

## Open Questions

- Exact default first-open placement when Ask is also open (corner vs offset) — implementer may tune without spec change.
- Whether Escape closes notes when focus is inside the window — recommended yes; confirm during apply if it conflicts with editor expectations.
- Visual baseline for notes-open — optional per e2e-coverage (MAY); skip unless screenshots are already easy to update.
