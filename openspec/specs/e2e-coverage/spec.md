# e2e-coverage Specification

## Purpose

Browser-level acceptance coverage for TypeScript School: dual-pane static
diagnostics, learner quiz/exercise flows (solution-match Check), progress and
theme persistence, global search, axe accessibility smoke, and committed visual
baselines against the prerendered CSP-bound preview server.
## Requirements
### Requirement: Dual-pane static diagnostics

The built site MUST render both JavaScript and TypeScript panes for an authored
(non-placeholder) lesson, and the TypeScript diagnostics region MUST show the
build-time Strada diagnostic for that lesson's authored pane (static map from
`build-time-diagnostics`, not live rechecking). Editing the TypeScript pane
MUST NOT be required to reveal that diagnostic, and MUST NOT be asserted to
produce new live diagnostics.

#### Scenario: Authored lesson shows both panes

- **GIVEN** a beginner lesson with real JS and TS content (not a placeholder)
- **WHEN** the learner opens that lesson on Chromium Desktop
- **THEN** the page MUST expose a JavaScript pane and a TypeScript pane

#### Scenario: Authored pane shows a static diagnostic

- **GIVEN** an authored lesson whose TS pane has a known expected diagnostic
  (for example `TS2345` on the first-type-error fixture)
- **WHEN** the learner opens that lesson
- **THEN** the diagnostics region MUST show that TS diagnostic (code and
  message) from the build-time map without requiring a live typecheck round-trip

### Requirement: Quiz and exercise flows

A lesson that authors a quiz and an exercise MUST allow the learner to complete
both flows in the browser. Exercise pass MUST follow solution-match per
`build-time-diagnostics` / `learner-features`.

#### Scenario: Quiz answers give feedback

- **GIVEN** a lesson with an authored quiz
- **WHEN** the learner selects an answer for a question
- **THEN** the page MUST show quiz feedback for that question

#### Scenario: Exercise check can pass

- **GIVEN** a lesson with an authored exercise whose solution is present
- **WHEN** the learner pastes that solution and activates Check
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

### Requirement: Disclaimer gate smoke

The built site MUST enforce the mandatory terms gate. E2E suites that are not
disclaimer-focused MAY seed `ts-school-toc-accepted` for the current version so
they exercise app content; a dedicated disclaimer smoke MUST clear that seed,
decline to `/farewell`, and accept to unlock.

#### Scenario: Decline reaches farewell

- **GIVEN** a Chromium Desktop visitor with no current ToC acceptance
- **WHEN** they decline the disclaimer gate
- **THEN** the browser MUST land on `/farewell` and stay there when navigating
  to curriculum

#### Scenario: Accept unlocks the site

- **GIVEN** a Chromium Desktop visitor with no current ToC acceptance
- **WHEN** they accept the disclaimer gate
- **THEN** the gate MUST close and the home page content MUST be usable

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

### Requirement: Critical-path e2e covers AI risk, XSS markdown, and edit Accept/Reject

Playwright MUST cover: AI risk modal accept/decline/version re-consent; adversarial assistant markdown that does not execute scripts or navigate via `javascript:`; and pending AI edit Accept/Reject (DOM-injected or mocked pending edit is acceptable).

#### Scenario: AI risk decline closes chat
- **WHEN** a learner opens Ask without AI risk acceptance and declines
- **THEN** the chat sidebar closes and remains locked

#### Scenario: Adversarial markdown is inert
- **WHEN** an assistant bubble is rendered from adversarial markdown containing script tags or `javascript:` links
- **THEN** no script executes and `javascript:` links are not followed as navigation

### Requirement: Axe smoke includes glossary, about, terms, farewell, and open overlays

Axe serious/critical smoke MUST include `/glossary`, `/about`, `/terms`, `/farewell`, the disclaimer gate while visible, and the AI risk modal while visible (color-contrast may remain disabled with documented vd3 limitation).

#### Scenario: Additional routes in axe
- **WHEN** the a11y e2e suite runs
- **THEN** those routes and overlay states are included

### Requirement: Mobile responsive critical paths are gated

The release gate MUST run a Chromium Mobile project covering navbar drawer, dual-pane tabs on narrow viewports, sidebar toggle, and AI chat overlay behavior below the dock breakpoint.

#### Scenario: Dual-pane tabs on mobile
- **WHEN** a lesson is viewed at Chromium Mobile viewport
- **THEN** JS/TS panes are presented via tabs rather than a side-by-side grid

### Requirement: Editing the TS pane does not change static diagnostics

E2e MUST assert that editing the editable TypeScript pane leaves the displayed build-time diagnostics list unchanged.

#### Scenario: Edit invariance
- **WHEN** a learner edits the TS pane on a lesson with known diagnostics
- **THEN** the diagnostics region still shows the same build-time codes/messages

### Requirement: Critical-path e2e covers Profile and notes

Playwright Chromium Desktop MUST cover: navigate to `/profile` via the navbar profile control; progress summary reflects seeded `ts-school-progress`; notes open/edit/persist across reload; notes pin left XOR right at desktop width; export triggers a downloadable JSON containing progress and notes when seeded; clear-all confirm wipes progress and notes; clear-all cancel leaves data. Stubbed AI context unit or e2e smoke MUST assert progress appears in composed chat context or `get_learner_progress` without loading real model weights.

#### Scenario: Profile via navbar

- **GIVEN** ToC acceptance seeded
- **WHEN** the learner activates the profile control
- **THEN** `/profile` is shown

#### Scenario: Notes persist

- **GIVEN** the notes sidebar open
- **WHEN** the learner enters text and reloads
- **THEN** the notes body is restored from `ts-school-notes`

#### Scenario: Clear all confirm wipes data

- **GIVEN** seeded progress and notes
- **WHEN** Clear all is confirmed
- **THEN** progress and notes keys are absent after reload

### Requirement: Axe and visual coverage include Profile and notes

Axe serious/critical smoke MUST include `/profile` and an open notes sidebar state. Chromium Desktop visual baselines MUST include `/profile` (and MAY include a notes-open shell snapshot if baselines are used for overlays).

#### Scenario: Profile in axe

- **WHEN** the a11y e2e suite runs
- **THEN** `/profile` is included

#### Scenario: Profile visual baseline

- **WHEN** visual e2e runs
- **THEN** `/profile` has a committed Chromium Desktop baseline assertion

