## MODIFIED Requirements

### Requirement: AI risks live in the site ToC

The mandatory site disclaimer (`DISCLAIMER_SECTIONS` / `TOC_VERSION`) MUST cover Ask assistant themes: local model resource use, hallucination / incomplete advice, no professional or security guarantee, human Accept for tool-backed editor edits, EU AI Act Art. 50 transparency for AI-assisted content and the assistant, and privacy (in-browser chat history stored locally in this browser's localStorage; not uploaded to TypeScript School; opt-in Hugging Face / CDN fetches). Terms and About MUST describe these risks as part of the main terms, not a second gate.

#### Scenario: Privacy mentions local chat history

- **WHEN** the learner reads the disclaimer gate or `/terms`
- **THEN** the privacy section states Ask chat history is stored locally in the browser and is not uploaded to a TypeScript School server
