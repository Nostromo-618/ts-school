## 1. Geometry helpers and store

- [x] 1.1 Add pure helpers for notes window geometry: types (`NotesWindowV1`), parse/validate, defaults, min size, viewport clamp, and legacy pin-side → default `x` seeding
- [x] 1.2 Extend `useNotesStore`: replace `pinned` / `pinSide` with `window` geometry + `folded`; persist `ts-school-notes-window` and `ts-school-notes-folded`; remove writes to pin keys
- [x] 1.3 On hydrate: load geometry/fold, seed from legacy pin keys when needed, delete `ts-school-notes-pinned` / `ts-school-notes-pin-side`; keep `open` session-only (no auto-open); `closeNotes` no longer “unpins”
- [x] 1.4 Unit tests: geometry parse/clamp/migrate; store round-trip for window + fold; legacy key cleanup; body persist unchanged (`tests/unit/notes-store.spec.ts` and/or new helper spec)

## 2. Notes modal UI

- [x] 2.1 Refactor `TsNotesSidebar.vue` into floating notes modal (rename to `TsNotesModal.vue` if clean): title bar with drag affordance, fold, close; keep edit/preview; update `data-testid`s (`ts-notes-modal`, drag/resize/fold handles)
- [x] 2.2 Implement pointer drag and resize (no new dependency); persist on pointerup; re-clamp on window resize; enforce min size
- [x] 2.3 Implement fold (title-bar-only) with persisted state; unfold restores expanded height from stored geometry
- [x] 2.4 Accessibility: accessible name for Notes; keyboard-reachable fold/close; Escape closes when focus is inside the window; non-modal dialog (no focus trap blocking lesson reading)
- [x] 2.5 Narrow viewport (`< 48rem`): near-full-screen sheet fallback; disable free drag/resize; keep fold/close/edit/preview

## 3. Shell and Ask coexistence

- [x] 3.1 Update `App.vue`: drop `is-notes-pinned-*` classes; wire modal open/close; keep `ts:open-notes` / navbar entry points
- [x] 3.2 Update `app.css`: remove notes dock insets / dual-dock notes rules; keep AI dock; set notes z-index above Ask (design D8); layout-only CSS
- [x] 3.3 Verify both Ask and notes can be open without mutual close and without notes inset on main content

## 4. Profile, hygiene, protected keys

- [x] 4.1 Update `data-hygiene.ts`: inventory, export preferences, and clear-all for `ts-school-notes-window` / `ts-school-notes-folded`; clear residual legacy pin keys; stop requiring pin keys
- [x] 4.2 Update `vd3-theme-storage.ts` protected keys list for new notes prefs; drop or keep legacy keys only while migration might still see them
- [x] 4.3 Adjust Profile copy/labels if inventory strings mention pin left/right
- [x] 4.4 Unit tests: `data-hygiene.spec.ts` and `vd3-theme-storage.spec.ts` cover new keys and clear-all

## 5. Playwright and a11y coverage

- [x] 5.1 Update `tests/e2e/profile-notes.spec.ts`: remove pin left/right cases; add open/close, body persist, drag persist, resize persist, fold persist (assert storage and/or bounding boxes)
- [x] 5.2 Add coexistence e2e: Ask open then notes open on desktop; both remain available
- [x] 5.3 Add mobile sheet e2e at responsive suite width (e.g. 390px): open notes, fold/close work without dock insets
- [x] 5.4 Update `a11y.spec.ts` notes-open path for new modal testids/selectors; keep serious/critical smoke green
- [x] 5.5 Optionally refresh Chromium visual baseline for `/profile` only if markup drift fails CI (notes-open baseline remains MAY)

## 6. Verification

- [x] 6.1 Run unit suite for notes/hygiene/theme (`pnpm` vitest targets touched by this change)
- [x] 6.2 Run Playwright specs touched above (profile-notes, a11y notes path, responsive notes mobile)
- [x] 6.3 Manual smoke: desktop drag/resize/fold + Ask open; mobile sheet; Profile export/clear-all inventory
