## ADDED Requirements

### Requirement: Exercise Check remains solution-match

Learner-facing Check MUST continue to pass via normalized solution-match against the authored solution; compiler assertions remain a CI / compiler-truth concern.

#### Scenario: Fail path
- **WHEN** a learner submits exercise code that does not match the solution
- **THEN** Check reports failure without implying a live typecheck ran in the browser
