# Tasks

## 1. Data model

- [x] 1.1 Read `src/typecheck/types.ts` (owned by the sibling change) and import
      `ExpectedDiagnostic` from it rather than redefining the contract.
- [x] 1.2 Author `src/curriculum/types.ts`: `Tier`, `TrackId`, `LessonId`,
      `LineRange`, `CodePane`, `TsCodePane`, `QuizQuestion`, `Exercise`,
      `Reference`, `SecurityNote`, `Track`, `Lesson`. All code fields are plain
      strings; no field is rendered as HTML. `diagram` is typed as
      `VdFlowchartDocument` from `@vanduo-oss/vd3-cbun/flowchart` — the actual
      prop type of `VdFlowchart`, imported type-only so no runtime code enters
      the bundle.
- [x] 1.3 Author `src/curriculum/tracks.ts`: the ten tracks with id, title,
      icon, order, and description, plus `TRACK_IDS` and `trackById`. Every
      icon name was checked against the `ph-*` classes the vd3 stylesheet
      actually ships.
- [x] 1.4 Author `src/curriculum/placeholder.ts`: marked TODO panes and
      `isPlaceholder()`.
- [x] 1.5 Author `src/curriculum/presentation.ts`: tier labels, tier icons, and
      the `VdBadge` variant per tier, so the sidebar, the map, the glossary, and
      the future `TierBadge` agree on one ladder.

## 2. Lessons and registry

- [x] 2.1 Author the `foundations` track's seventeen lessons, one typed
      `Lesson` per file under `src/curriculum/lessons/foundations/`, with tier,
      order, prerequisites, keywords, summary, and problem statement filled in
      and placeholder code panes.
- [x] 2.2 Author `src/curriculum/lessons/foundations/index.ts` collecting them
      in order.
- [x] 2.3 Author `src/curriculum/index.ts`: deterministic sort, `allLessons`,
      `lessonById`, `lessonsByTrack`, `lessonsByTier`, `lessonRoute`,
      `lessonNeighbours`, `lessonCounts`.

## 3. Derivations

- [x] 3.1 Author `src/nav.ts`: `NavTree` derived from the registry, keeping the
      `vd3-docs` shapes verbatim. Tabs are tiers, categories are tracks,
      sections are lessons; empty tabs and categories are omitted. A lesson's
      summary joins its keyword list so search matches prose the reader saw.
- [x] 3.2 Author `src/pages/LessonPage.vue` — placeholder renderer, marked as
      such in a file-level comment.
- [x] 3.3 Modify `src/router.ts` to splice derived lesson routes ahead of the
      catch-all. `src/main.ts` untouched, as the scaffold intended.

## 4. Integrity suite

- [x] 4.1 `tests/unit/curriculum.spec.ts`: ids unique and URL-safe; titles,
      summaries, problems and keywords non-empty; tracks declared; no
      self-prerequisite; no repeated prerequisite; prerequisites resolve;
      prerequisite graph acyclic via Kahn's algorithm consuming every node; no
      dependency on a higher tier; `order` dense `1..n` per track; tier
      non-decreasing along a track; registry sort deterministic; counts
      consistent; `lessonNeighbours` walks a track.
- [x] 4.2 `tests/unit/nav.spec.ts`: nav section routes equal lesson routes as
      sets; tabs are tiers and categories are tracks, both in curriculum order;
      no empty tab or category; every section filterable; derived routes resolve
      through a real `vue-router` to their own record with the right `meta` and
      `props`; unknown lesson path still falls to not-found; catch-all last.

## 5. Verification

- [x] 5.1 `pnpm lint`, `pnpm stylelint`, and `pnpm typecheck` pass.
      `pnpm run format:check` passes for every file this change touches; the two
      files it reports are `src/typecheck/` work in progress owned by the
      sibling change and were deliberately left untouched.
- [x] 5.2 `pnpm test` passes — 63 assertions across 5 files, 39 of them new.
- [x] 5.3 `pnpm build` prerenders 18 pages: `/` plus one per lesson, each with
      real markup. The `/:pathMatch(.*)*` catch-all remains client-side.
- [x] 5.4 Derived nav/search verification: `nav.spec.ts` asserts the set of nav
      section routes equals the set of registry lesson routes, so a lesson that
      is added, renamed, or removed cannot silently fall out of navigation.
- [x] 5.5 `openspec validate add-curriculum-model --strict` passes.
