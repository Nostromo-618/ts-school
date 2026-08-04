## Purpose

Browser-level acceptance coverage for TypeScript School: dual-pane live
typechecking, learner quiz/exercise flows, progress and theme persistence,
global search, axe accessibility smoke, and committed visual baselines against
the prerendered CSP-bound preview server.

## ADDED Requirements

### Requirement: Dual-pane live diagnostics

The built site MUST render both JavaScript and TypeScript panes for an authored
(non-placeholder) lesson, and typing in the TypeScript pane MUST produce a live
diagnostic from the in-browser TypeScript worker.

#### Scenario: Authored lesson shows both panes

- **GIVEN** a beginner lesson with real JS and TS content (not a placeholder)
- **WHEN** the learner opens that lesson on Chromium Desktop
- **THEN** the page MUST expose a JavaScript pane and a TypeScript pane

#### Scenario: Editing TS produces a live diagnostic

- **GIVEN** an authored lesson whose TS pane has a known expected diagnostic
  when broken
- **WHEN** the learner edits the TypeScript pane so that a type error appears
- **THEN** the diagnostics region MUST show a live TS diagnostic (code and
  message) without a page reload

### Requirement: Quiz and exercise flows

A lesson that authors a quiz and an exercise MUST allow the learner to complete
both flows in the browser.

#### Scenario: Quiz answers give feedback

- **GIVEN** a lesson with an authored quiz
- **WHEN** the learner selects an answer for a question
- **THEN** the page MUST show quiz feedback for that question

#### Scenario: Exercise check can pass

- **GIVEN** a lesson with an authored exercise whose solution satisfies the
  assertion
- **WHEN** the learner pastes a passing solution and activates Check
- **THEN** the page MUST indicate the exercise passed

### Requirement: Progress persistence

Learner progress MUST survive a full page reload via the schema-validated
`ts-school-progress` localStorage key.

#### Scenario: Progress survives reload

- **GIVEN** the learner has recorded quiz or exercise progress for a lesson
- **WHEN** the page is reloaded
- **THEN** `localStorage` under `ts-school-progress` MUST still contain that
  lesson's progress

### Requirement: Global search navigation

The cmd+K (or Control+K) global search MUST open and navigate to a matching
lesson.

#### Scenario: Search opens and navigates

- **GIVEN** the learner is on any page of the site
- **WHEN** they open global search, type a known lesson title fragment, and
  select a result
- **THEN** the browser MUST navigate to that lesson route

### Requirement: Theme persistence

Theme mode changes MUST persist across reload via the shared Vanduo theme
preference storage.

#### Scenario: Theme switch persists

- **GIVEN** the learner switches the theme to dark (or light, if already dark)
- **WHEN** the page is reloaded
- **THEN** the document theme MUST remain the chosen mode

### Requirement: Accessibility smoke

Key pages MUST pass an `@axe-core/playwright` accessibility scan with no
serious or critical violations.

#### Scenario: Axe smoke on key routes

- **GIVEN** the built site is served under the configured Playwright preview
- **WHEN** axe runs against home, curriculum, one authored lesson, and history
- **THEN** each scan MUST report zero serious or critical violations

### Requirement: Visual baselines

Key pages MUST have committed Chromium Desktop screenshot baselines, and
`pnpm test:e2e` MUST assert them.

#### Scenario: Visual snapshots for key pages

- **GIVEN** Chromium Desktop at the configured viewport
- **WHEN** Playwright captures home, curriculum, one authored lesson, and
  history
- **THEN** each capture MUST match the committed baseline snapshot
