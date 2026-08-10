## ADDED Requirements

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
