# Change: Force TypeScript 7 + build-time diagnostics

## Summary

Upgrade primary `typescript` to 7.0.2, remove the in-browser typecheck worker,
generate lesson diagnostics at build time with `typescript-strada@6.0.3`, and
switch exercises to solution-match. Also bump stack deps (pinia 4, unhead 3,
vd3 1.2.2, etc.) and apply focused vd3 dogfooding.

## Non-goals

- Restoring live-as-you-type checking in the browser
- Catalog-maxing every vd3 component
- Waiting for TS 7.1 stable API before shipping
- Deploy / hosting changes

## Impact

- Specs: replace `typecheck-worker` with `build-time-diagnostics`; update
  repo-scaffold / lesson-engine / e2e-coverage / supporting-pages narratives
- Code: delete worker/client/libs/sync-ts-libs/harness; add generator +
  generated map; DualPane/ExerciseBlock/LiveTsPane static wiring
