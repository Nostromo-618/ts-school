## Context

See `proposal.md` — Why. The lesson engine and typecheck worker are in place.
`curriculum.vue` already has an HTML comment marking the `VdProgress` seam.
`main.ts` forbids `initialState` for CSP reasons; progress must hydrate from
localStorage on the client only.

## Goals / Non-Goals

**Goals:**

- A progress store that fails closed on bad data.
- Quiz / exercise UI that dogfoods vd3 components and the real worker.
- Clean curriculum meters without restructuring the map page.

**Non-Goals:**

- Multi-device sync, accounts, or server APIs.
- Authoring quiz/exercise content.

## Decisions

### Schema version 1

```ts
interface ProgressV1 {
  version: 1;
  lessons: Record<string, {
    status: "in-progress" | "complete";
    quizScore?: { correct: number; total: number };
    exercisePassed?: boolean;
    updatedAt: string; // ISO
  }>;
}
```

Storage key: `ts-school-progress`. On read: `JSON.parse` in try/catch; require
`version === 1`, `lessons` is a plain object, each entry has a known `status`
and optional typed fields. Anything else → `{}`.

Alternatives considered. *unversioned blob*: rejected — no migration path.
*zod dependency*: rejected — a 30-line hand validator is enough and avoids a
new runtime dep.

### Hydration timing

`useProgressStore().hydrate()` runs from `App.vue` `onMounted` (alongside theme
init) or lazily on first store access behind `typeof window`. Never during SSR.
Writes debounce or write-through on every mutation (write-through is fine —
payloads are tiny).

### QuizBlock

Props: `lessonId`, `questions: QuizQuestion[]`. Local state for selected
answers. On full completion, call `progress.recordQuiz(lessonId, correct,
total)` and optionally `markComplete` if the lesson has no exercise (or always
mark in-progress / complete per LessonPage policy).

Policy: LessonPage marks complete when (a) user clicks Mark complete, or (b)
quiz finished AND (no exercise OR exercise already passed), or (c) exercise
passed AND (no quiz OR quiz already scored). Visiting DualPane / page marks
`in-progress`.

### ExerciseBlock

Props: `lessonId`, `exercise: Exercise`. Editable `VdCodeEditor` +
`useTypecheck` + Check button (or auto on debounce). Pass logic:

```ts
if (assertion === "no-errors") return diagnostics.length === 0;
return matchesExpected(diagnostics, assertion).matched;
```

Hints revealed on request. Solution reveal optional (`exercise.solution`).

### Compiler-truth extension

In `compiler-truth.spec.ts`, for authored lessons with `exercise?.solution`:
- `"no-errors"` → expect `session.check(solution).diagnostics` empty
- array → `matchesExpected(..., assertion).matched`

### Curriculum meters

Replace the comment seam with:

```vue
<VdProgress
  :value="completedInTrack"
  :max="entry.lessons.length"
  :label="`${completedInTrack} of ${entry.lessons.length} complete`"
/>
```

Use the progress store; during SSR meters read empty (0).

## Risks / Trade-offs

- [Risk] localStorage quota / private mode → Mitigation: try/catch writes;
  fail soft.
- [Risk] Schema drift from content agents → Mitigation: version field; bump
  intentionally in a future change.

## Migration Plan

No migration of existing user data (none exists). Schema v1 is the first.

## Open Questions

_None._
