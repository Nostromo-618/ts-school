# lesson-ai-assistant Specification

## Purpose

In-lesson local Gemma assistant with allowlisted tools and confirm-gated VdCodeEditor edits.

## Requirements

### Requirement: Opt-in model load

The chat sidebar MUST NOT download or load a model until the learner activates Load. Default model MUST be Gemma 4 E2B; E4B MUST be selectable. The model picker MUST keep E2B as the default selection while labeling E4B as the quality upgrade recommended on capable hardware (approximately ≥8GB RAM / `navigator.deviceMemory` ≥ 8). Picker helper copy MUST explain that E2B is faster to load and E4B may give richer answers at +~0.5GB. The product MUST NOT auto-switch the default to E4B without an OpenSpec change backed by comparative eval evidence.

#### Scenario: Idle until load

- **WHEN** a lesson page mounts with chat closed or open but unloaded
- **THEN** no LiteRT engine is created yet

#### Scenario: E2B remains default selection

- **WHEN** the chat sidebar opens before the learner changes the model
- **THEN** the selected model id is `gemma-4-E2B-it-web`

#### Scenario: E4B labeled as quality recommendation

- **WHEN** the model picker lists official LiteRT Gemma options
- **THEN** the E4B option label indicates Quality and recommends capable hardware (≥8GB RAM)

### Requirement: Allowlisted tools with confirm on writes

Tools MUST be limited to search_curriculum, get_lesson, read_ts_editor, propose_ts_edit / apply_ts_edit, navigate_lesson. apply_ts_edit MUST require explicit user confirmation before mutating the editor store.

#### Scenario: Apply requires confirm

- **WHEN** the model requests apply_ts_edit
- **THEN** the editor text does not change until the learner accepts

### Requirement: Lesson context in system prompt

The assistant system prompt MUST include product TypeScript School context and a size-capped pack for the current lesson (id, title, summary, problem, insights, diagnostics snapshot).

#### Scenario: Context includes lesson id

- **WHEN** chat loads on a lesson page
- **THEN** the composed system prompt includes that lesson's id

### Requirement: Off-lesson location and curriculum primer

When no lesson is open, the system prompt MUST still include the current route/location kind, a curriculum primer with `firstLesson` (id, title, route matching the home CTA), track summaries, and standalone page routes. Fixed tutor policy MUST require tool-backed citations and recommend `curriculumPrimer.firstLesson` for beginner / “where to start” questions. Policy MUST NOT be dropped when refreshing context on load or send.

#### Scenario: Home starter recommendation is grounded

- **WHEN** chat composes context on `/` with no lesson id
- **THEN** the context JSON includes `location.kind` of `home` and `curriculumPrimer.firstLesson.route` of `/lessons/foundations/why-types`

#### Scenario: Do not invent lessons

- **WHEN** the learner asks where to start
- **THEN** the assistant cites primer or tool results only (not invented titles such as “Basic Types”)

### Requirement: Assistant markdown and navigable links

Assistant messages MUST render markdown (bold, code, markdown links). Cited app routes and known lesson/page titles MUST become navigable links that use the SPA router for internal paths. User messages MUST remain plain text.

#### Scenario: Markdown bold renders

- **WHEN** an assistant reply contains `**About**`
- **THEN** the bubble shows bold text without literal asterisks

#### Scenario: Lesson route is clickable

- **WHEN** an assistant reply cites `/lessons/foundations/why-types` or the matching lesson title
- **THEN** the bubble contains an anchor that navigates to that lesson
