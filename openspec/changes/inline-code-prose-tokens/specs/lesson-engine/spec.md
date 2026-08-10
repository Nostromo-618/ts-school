## MODIFIED Requirements

### Requirement: dual-pane JS and TS editors

The lesson page MUST present the lesson's JavaScript pane and TypeScript pane
together. On viewports wide enough for side-by-side layout the panes SHALL
appear adjacent (JS left, TS right). On narrow viewports the panes SHALL be
reachable through tabs. The JavaScript pane MUST be read-only. The TypeScript
pane MUST be editable. Lesson **source** (JS/TS pane and exercise editor
buffers) MUST reach the DOM only as plain text — never via `v-html`,
`innerHTML`, or equivalent HTML injection. Authored **prose** fields (summary,
problem, insights, security body, captions, quiz/exercise copy) MAY render
through an escaped Labs markdown → HTML pipeline so markdown inline code
becomes `<code>`; that pipeline MUST escape raw HTML from curriculum strings.

#### Scenario: authored lesson shows both panes

- **GIVEN** a lesson whose JS and TS panes are authored (not placeholders)
- **WHEN** the learner opens that lesson
- **THEN** both panes render their authored source, the JS pane cannot be
  edited, and the TS pane accepts edits

#### Scenario: mobile uses tabs

- **GIVEN** a viewport too narrow for side-by-side panes
- **WHEN** the learner opens a lesson
- **THEN** JavaScript and TypeScript are available as separate tabs and each
  tab shows the corresponding pane

#### Scenario: prose backticks become code without injecting raw HTML

- **GIVEN** a lesson whose summary or problem contains markdown backticks
- **WHEN** the learner opens that lesson
- **THEN** the backticked spans render as `<code>` and raw HTML in the string
  is escaped, not executed

### Requirement: lesson page composition

One lesson route component MUST render every lesson: breadcrumbs, title, tier
badge, track label, summary, problem, dual pane, insight bullets when present,
an optional security note when present, an optional flowchart when diagram data
is present, optional quiz and exercise blocks when authored, a mark-complete
control, and previous/next navigation. Missing optional fields MUST be omitted
without error. Quiz answer choices MUST show sequential letter prefixes
(**A**, **B**, **C**, **D**, …) matching choice order, visible to sighted
users and exposed to assistive technology. Choice buttons MUST provide a
tasteful hover affordance using existing vd design tokens without replacing
keyboard focus styles. Lesson sidebar nav links (active and hover highlights)
MUST use the site's global border-radius token so highlight boxes match tier
buttons and filter controls rather than sharp 90° corners.

#### Scenario: insights and security note render when authored

- **GIVEN** a lesson with non-empty `insight` and a `security` note
- **WHEN** the page renders
- **THEN** each insight appears as a list item and the security note shows its
  title, body, and severity

#### Scenario: absent diagram is omitted

- **GIVEN** a lesson with no `diagram`
- **WHEN** the page renders
- **THEN** no flowchart region is shown and the page does not error

#### Scenario: quiz and exercise render when authored

- **GIVEN** a lesson with both `quiz` and `exercise`
- **WHEN** the page renders
- **THEN** both blocks are shown beneath the dual pane

#### Scenario: quiz choices are lettered A B C D

- **GIVEN** a lesson quiz with four choices
- **WHEN** the quiz block renders
- **THEN** the choices are labeled A, B, C, and D in order

#### Scenario: sidebar lesson highlights are rounded

- **GIVEN** the lesson sidebar on a lesson route
- **WHEN** a lesson link is hovered or is the active route
- **THEN** the highlight background uses the global vd border-radius token
