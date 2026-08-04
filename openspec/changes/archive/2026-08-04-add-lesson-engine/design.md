## Context

See `proposal.md` — Why. Constraints that shape the approach:

- `useTypecheck`, `matchesExpected`, and `createTypecheckSession` already exist
  under `@/typecheck`. Components import only from `@/typecheck`; Node/CI tests
  may import `@/typecheck/host`.
- Curriculum stubs use `isPlaceholder()` / `PLACEHOLDER_MARKER`. The taxonomy
  is complete; almost every pane is still a stub.
- `VdCodeEditor` is a textarea-overlay editor with `setSelection` / `focus` but
  no gutter-marker API. `VdTabs` exposes `tabs` + `modelValue` and a single
  default slot (the consumer switches pane content by the active tab id).
- `VdFlowchart` accepts a `data` document and `readonly`. Lesson `diagram` is
  already typed as `VdFlowchartDocument`.
- CSP forbids `eval` / `new Function` / `v-html`; ESLint enforces the same.
- SSG prerender must not construct a Worker; `useTypecheck` already guards on
  `onMounted` / `typeof window`.

## Goals / Non-Goals

**Goals:**

- One `LessonPage` that renders any lesson from the registry.
- Honest dual-pane UX that dogfoods published vd3 / vd3-cbun components.
- Compiler-truth skip rule documented and enforced so content-tier agents can
  land panes without first rewriting the engine.

**Non-Goals:**

- Quiz / exercise / progress (next change).
- Authoring lesson content.
- Extending `VdCodeEditor` with gutter markers.

## Decisions

### DualPane owns the typecheck binding

`DualPane` receives `js` / `ts` panes (and optional `TypecheckOptions`). It
owns the editable `code` ref, calls `useTypecheck` when the TS pane is
authored, and renders `DiagnosticsList`. `LessonPage` stays a composition
root.

Alternatives considered. *LessonPage owns useTypecheck and passes diagnostics
down*: rejected — every future exercise block would duplicate the binding, and
DualPane would be a dumb layout shell. *A shared composable only*: still need
the layout component; DualPane is the right boundary.

### Skip live typecheck only for placeholder TS panes

`isPlaceholder(lesson.ts)` gates worker creation. An authored pane with
`expectedDiagnostics: []` still runs live typecheck — empty means "the
compiler is silent", which is a claim worth verifying live.

Alternatives considered. *Also skip when expectedDiagnostics is empty*:
rejected — that would disable the live checker for every clean "fixed"
example content authors will write.

### Prerendered fallback maps ExpectedDiagnostic → TsDiagnostic

`expectedDiagnostics` lacks column / length / full message. The fallback mapper
fills `category: "error"`, `column: 1`, `length: 0`, and
`message: messageIncludes ?? \`TS${code}\``. Live worker results replace this
after the first response. Display of fallback vs live is transparent to the
list component.

### Jump-to-line via character offset

`DiagnosticsList` emits `jump` with `{ line, column }`. DualPane converts to a
0-based offset in the current source and calls the TS editor's exposed
`setSelection` + `focus`. No gutter highlight is attempted.

### Compiler-truth skip rule

For each lesson in the registry:

1. If `isPlaceholder(lesson.ts)`, **skip** (do not call the compiler).
2. Otherwise check `lesson.ts.code` with `createTypecheckSession` (libs from
   `public/ts-lib/`, same loader as `typecheck-host.spec.ts`) and assert
   `matchesExpected(actual, lesson.ts.expectedDiagnostics).matched`.
3. When learner features land, the same suite will also check exercise
   `solution` strings against `exercise.assertion`; that extension is owned by
   `add-learner-features` and is only noted here.

Document this skip rule in the suite file header so content agents know: the
moment a pane loses the placeholder marker, CI holds it to the compiler.

### TierBadge wraps presentation constants

`TierBadge` takes a `Tier` and renders `VdBadge` with `TIER_LABELS` /
`TIER_BADGE_VARIANTS` from `@/curriculum`. LessonPage and later pages share one
component instead of restating the ladder.

### Responsive layout

Desktop (≥992px, matching the shell sidebar breakpoint): CSS grid two columns.
Below that: `VdTabs` with ids `js` / `ts`. Both layouts share the same editor
instances via a single template structure where possible, or duplicate panes
with `v-if` on a media-query composable — prefer CSS `display` toggle of the
side-by-side vs tabs wrappers so editors are not double-mounted.

Decision: use a CSS media-query class on a wrapper — `.ts-dual-pane-desktop`
hidden below 992px, `.ts-dual-pane-mobile` hidden at/above — each containing
its own editors. Double-mounting is acceptable for stubs; for live typecheck
only the desktop TS editor OR the mobile one should drive `useTypecheck`.

Better approach: **one pair of editors**, desktop grid by default, and on
mobile wrap visually with tabs that show/hide panes via CSS/`v-show` without a
second mount. Structure:

```
.dual-pane
  VdTabs (mobile only chrome) OR plain headers (desktop)
  .panes (grid on desktop; stacked with v-show on mobile)
```

Simplest honest approach matching the plan: desktop grid; mobile VdTabs;
`v-if` on `isMobile` from a `matchMedia('(max-width: 991px)')` ref so only one
layout mounts. Typecheck binds to whichever TS editor is mounted.

### Diagram optional mount

```vue
<VdFlowchart v-if="lesson.diagram" :data="lesson.diagram" readonly auto-fit />
```

Import from `@vanduo-oss/vd3-cbun/flowchart`. CSS already in `main.ts`.

## Risks / Trade-offs

- [Risk] Double editor mount on resize thrash → Mitigation: bind matchMedia once;
  avoid remounting on every pixel; only swap at the breakpoint.
- [Risk] Fallback diagnostics look "wrong" (column 1, partial message) until
  hydration → Mitigation: acceptable for SSG; live results replace quickly;
  authored `messageIncludes` is usually enough prose.
- [Risk] Content agents forget the skip rule and land panes that fail CI →
  Mitigation: suite header documents the rule; failure messages use
  `formatDiagnosticMatch`.

## Migration Plan

No migration. Placeholder `LessonPage` is replaced in place. Existing routes
unchanged. Archive the OpenSpec change after gates pass.

## Open Questions

_None — skip rule and live-typecheck gate are decided above._
