## MODIFIED Requirements

### Requirement: Critical-path e2e covers Profile and notes

Playwright Chromium Desktop MUST cover: navigate to `/profile` via the navbar profile control; progress summary reflects seeded `ts-school-progress`; notes open/edit/persist across reload; notes floating window drag position and resize persist across reload at desktop width; notes fold persists across reload; notes open/close from the navbar; export triggers a downloadable JSON containing progress and notes when seeded; clear-all confirm wipes progress and notes (and notes window preference keys when seeded); clear-all cancel leaves data. Stubbed AI context unit or e2e smoke MUST assert progress appears in composed chat context or `get_learner_progress` without loading real model weights. Playwright MUST also cover notes open while Ask AI is open (coexistence) at desktop width, and notes open as a sheet fallback at a mobile viewport width used by the responsive suite.

#### Scenario: Profile via navbar

- **GIVEN** ToC acceptance seeded
- **WHEN** the learner activates the profile control
- **THEN** `/profile` is shown

#### Scenario: Notes persist

- **GIVEN** the notes modal open
- **WHEN** the learner enters text and reloads
- **THEN** the notes body is restored from `ts-school-notes`

#### Scenario: Notes geometry and fold persist

- **GIVEN** desktop viewport with notes open
- **WHEN** the learner drags, resizes, and folds notes, then reloads and reopens notes
- **THEN** position, size, and fold state are restored from school-owned preference keys

#### Scenario: Notes and Ask coexist

- **GIVEN** Ask AI open on desktop
- **WHEN** the learner opens notes
- **THEN** both overlays remain available

#### Scenario: Clear all confirm wipes data

- **GIVEN** seeded progress and notes
- **WHEN** Clear all is confirmed
- **THEN** progress and notes keys are absent after reload

### Requirement: Axe and visual coverage include Profile and notes

Axe serious/critical smoke MUST include `/profile` and an open notes modal state. Chromium Desktop visual baselines MUST include `/profile` (and MAY include a notes-open shell snapshot if baselines are used for overlays).

#### Scenario: Profile in axe

- **WHEN** the a11y e2e suite runs
- **THEN** `/profile` is included

#### Scenario: Notes open in axe

- **WHEN** the a11y e2e suite runs with notes open
- **THEN** axe serious/critical checks include that notes-open state

#### Scenario: Profile visual baseline

- **WHEN** visual e2e runs
- **THEN** `/profile` has a committed Chromium Desktop baseline assertion
