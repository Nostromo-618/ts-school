# repo-scaffold Specification (delta)

## Modified Requirements

### Requirement: CSP allows opt-in search/AI network hosts

The meta CSP MAY widen `connect-src` and `worker-src` for Hugging Face / blob workers required by bundled Transformers and LiteRT model downloads. `script-src` MUST remain `'self'` (no CDN script execution). Learner code MUST still never execute.

#### Scenario: script-src stays self

- **WHEN** the CSP meta policy is inspected
- **THEN** `script-src` equals `'self'` only
