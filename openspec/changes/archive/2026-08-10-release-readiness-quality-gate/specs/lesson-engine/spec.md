## ADDED Requirements

### Requirement: Lesson UI discloses static diagnostics and solution-match

Editable TS panes and exercises MUST disclose that diagnostics are static (build-time) and that Check uses solution-match, not live rechecking.

#### Scenario: Diagnostics caption
- **WHEN** a learner views diagnostics under the TS pane
- **THEN** a caption states diagnostics were captured at build time and editing does not update the list

### Requirement: Enrichment includes first flowcharts and security notes outside runtime-boundary

At least one lesson MUST gain a flowchart enrichment, async glossary / assignability discoverability MUST improve where called out, and at least one non-runtime-boundary lesson MUST include a concise security note relevant to the concept.

#### Scenario: Flowchart present
- **WHEN** enrichment wave completes
- **THEN** at least one lesson body references a flowchart block rendered via vd3-cbun
