## ADDED Requirements

### Requirement: Hybrid curriculum search engine

The curriculum search store MUST use `HybridSearch` from
`@vanduo-oss/vdl-hybrid-search` (formerly `NeptuneSearch` from
`@vanduo-oss/vdl-engines`). Injectable Fuse/Transformers loaders MUST remain
supported for CSP.

#### Scenario: hybrid search constructs engine
- **GIVEN** the search store initializes
- **WHEN** `ensureEngine` runs
- **THEN** it constructs `HybridSearch` with curriculum index/vector URLs and
  host-provided loaders
