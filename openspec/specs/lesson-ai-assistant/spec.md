# lesson-ai-assistant Specification

## Purpose
TBD - created by archiving change dogfood-vdl-packages. Update Purpose after archive.
## Requirements
### Requirement: AiChat package import

The lesson AI assistant MUST load the headless engine from
`@vanduo-oss/vdl-ai-chat` and MUST import LLM/tool guardrails and markdown
helpers from that package's subpath exports.

#### Scenario: dynamic import
- **GIVEN** the AI sidebar loads a model
- **WHEN** it dynamically imports the engine
- **THEN** the module specifier is `@vanduo-oss/vdl-ai-chat`

