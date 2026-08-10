# ai-risk-disclaimer Specification

## Purpose
Assistant-specific AI risks are disclosed in the site-wide Terms of Conditions gate (and `/terms`). There is no separate Ask / AI risk modal or versioned `ts-school-ai-risk-accepted` consent flow for new visitors.

## Requirements
### Requirement: AI risks live in the site ToC

The mandatory site disclaimer (`DISCLAIMER_SECTIONS` / `TOC_VERSION`) MUST cover Ask assistant themes: local model resource use, hallucination / incomplete advice, no professional or security guarantee, human Accept for tool-backed editor edits, EU AI Act Art. 50 transparency for AI-assisted content and the assistant, and privacy (in-browser chat; opt-in Hugging Face / CDN fetches). Terms and About MUST describe these risks as part of the main terms, not a second gate.

#### Scenario: Opening Ask does not show a second modal
- **WHEN** the learner has accepted the current ToC version and opens Ask
- **THEN** the AI sidebar opens without an `AiRiskGate` / AI risk modal

#### Scenario: Required themes present in site terms
- **WHEN** the learner reads the disclaimer gate or `/terms`
- **THEN** the sections cover the assistant themes above

### Requirement: ToC version bump re-consents for AI copy changes

When AI risk copy in the site disclaimer changes meaningfully, `TOC_VERSION` MUST be bumped so returning visitors re-accept before using the site (including Ask).

#### Scenario: Version mismatch forces re-consent
- **WHEN** stored ToC acceptance version does not match the current `TOC_VERSION`
- **THEN** the site disclaimer gate is shown again

### Requirement: Clear all removes legacy AI risk key

When the learner confirms Clear all on Profile, the system MUST remove any legacy `ts-school-ai-risk-accepted` key if present, and MUST clear ToC acceptance so the site gate is required again. Opening Ask MUST NOT require a separate AI risk modal.

#### Scenario: Ask after clear all needs site terms only
- **GIVEN** a legacy AI risk key and/or ToC acceptance were stored
- **WHEN** Clear all is confirmed, the learner re-accepts the site terms, and opens Ask
- **THEN** the AI risk modal is not shown and the sidebar opens
