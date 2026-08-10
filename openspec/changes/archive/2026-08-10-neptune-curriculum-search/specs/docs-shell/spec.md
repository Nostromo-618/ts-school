# docs-shell Specification (delta)

## Modified Requirements

### Requirement: global search over the derived index

Global search MUST surface Neptune hybrid (or fuzzy-fallback) results from the curriculum search index, grouped by category path, without `v-html`.

#### Scenario: semantic or fuzzy source is indicated

- **WHEN** a result comes from Neptune merge
- **THEN** the UI may show a Fuzzy or Semantic source badge without constructing HTML from untrusted strings
