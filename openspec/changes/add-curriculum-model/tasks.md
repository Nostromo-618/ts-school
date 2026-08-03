# Tasks

## 1. Data model

- [ ] 1.1 Read `src/typecheck/types.ts` (owned by the sibling change) and import
      `ExpectedDiagnostic` from it rather than redefining the contract.
- [ ] 1.2 Author `src/curriculum/types.ts`: `Tier`, `TrackId`, `LessonId`,
      `LineRange`, `CodePane`, `TsCodePane`, `QuizQuestion`, `Exercise`,
      `Reference`, `SecurityNote`, `Track`, `Lesson`. All code fields are plain
      strings; no field is rendered as HTML.
- [ ] 1.3 Author `src/curriculum/tracks.ts`: the ten tracks with id, title,
      icon, order, and description, plus `TRACK_IDS` and `trackById`.
- [ ] 1.4 Author `src/curriculum/placeholder.ts`: marked TODO panes and
      `isPlaceholder()`.

## 2. Lessons and registry

- [ ] 2.1 Author the `foundations` track's lessons, one typed `Lesson` per file
      under `src/curriculum/lessons/foundations/`, with tier, order,
      prerequisites, keywords, summary, and problem statement filled in and
      placeholder code panes.
- [ ] 2.2 Author `src/curriculum/lessons/foundations/index.ts` collecting them
      in order.
- [ ] 2.3 Author `src/curriculum/index.ts`: deterministic sort, `allLessons`,
      `lessonById`, `lessonsByTrack`, `lessonsByTier`, `lessonRoute`,
      `lessonNeighbours`, `lessonCounts`.

## 3. Derivations

- [ ] 3.1 Author `src/nav.ts`: `NavTree` derived from the registry, keeping the
      `vd3-docs` shapes verbatim. Tabs are tiers, categories are tracks,
      sections are lessons; empty tabs and categories are omitted.
- [ ] 3.2 Author `src/pages/LessonPage.vue` — placeholder renderer, marked as
      such in a file-level comment.
- [ ] 3.3 Modify `src/router.ts` to splice derived lesson routes ahead of the
      catch-all. Do not touch `src/main.ts`.

## 4. Integrity suite

- [ ] 4.1 `tests/unit/curriculum.spec.ts`: ids unique and URL-safe; no
      self-prerequisite; prerequisites resolve; prerequisite graph acyclic via
      Kahn's algorithm consuming every node; no dependency on a higher tier;
      `order` dense `1..n` per track; tier non-decreasing along a track;
      registry sort deterministic.
- [ ] 4.2 `tests/unit/nav.spec.ts`: every lesson reachable from the derived
      tree and no orphan sections; no empty tab or category; derived routes
      resolve through a real router and none falls through to the catch-all;
      catch-all remains last.

## 5. Verification

- [ ] 5.1 `pnpm lint`, `pnpm stylelint`, `pnpm run format:check`, and
      `pnpm typecheck` pass.
- [ ] 5.2 `pnpm test` passes, including the new integrity suite.
- [ ] 5.3 `pnpm build` prerenders every derived lesson route with real markup;
      confirm the emitted file count matches the lesson count plus the static
      pages.
- [ ] 5.4 Derived nav/search verification: assert the set of nav section routes
      equals the set of registry lesson routes (house rule for any change that
      adds, renames, or removes lessons).
- [ ] 5.5 `openspec validate add-curriculum-model --strict` passes.
