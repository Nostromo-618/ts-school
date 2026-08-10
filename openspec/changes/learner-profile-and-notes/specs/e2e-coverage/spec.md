## ADDED Requirements

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
