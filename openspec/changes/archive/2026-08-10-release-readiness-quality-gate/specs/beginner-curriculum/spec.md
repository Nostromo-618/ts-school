## ADDED Requirements

### Requirement: Meta-lessons match dual-install and build-time diagnostics

Foundations, tooling, and node-migration meta-lessons MUST NOT claim an in-browser TypeScript Web Worker or live `createProgram` from typescript@7. They MUST describe typescript@7 tooling plus typescript-strada@6 (alias of the Strada / TS 6 API line) for build-time diagnostics.

#### Scenario: No live-worker product claim
- **WHEN** a unit stale-phrase gate scans lesson sources
- **THEN** banned phrases implying a live browser typecheck worker fail the suite

### Requirement: Runtime-boundary track order puts unknown-vs-any before where-types-end

The runtime-boundary track order MUST teach `unknown-vs-any` before `where-types-end`.

#### Scenario: Prerequisite order
- **WHEN** the curriculum registry is validated
- **THEN** `unknown-vs-any` appears before `where-types-end` in track order
