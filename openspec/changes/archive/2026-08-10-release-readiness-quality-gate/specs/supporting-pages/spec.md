## ADDED Requirements

### Requirement: Supporting pages disclose build-time Strada diagnostics honestly

About, home, history, and curriculum marketing copy MUST describe build-time Strada diagnostics and solution-match exercises — not an in-browser live typecheck worker.

#### Scenario: About page truth
- **WHEN** a learner opens `/about`
- **THEN** the page states diagnostics are captured at build time with Strada and editing does not re-run a browser compiler

### Requirement: Terms and About link to license and AI risks

Terms and About MUST link to the MIT license / third-party notices story and MUST surface that opening the AI assistant requires a separate AI risk acceptance.

#### Scenario: License link present
- **WHEN** a learner reads `/terms` or `/about`
- **THEN** they can find references to MIT / third-party notices and the AI assistant risk gate
