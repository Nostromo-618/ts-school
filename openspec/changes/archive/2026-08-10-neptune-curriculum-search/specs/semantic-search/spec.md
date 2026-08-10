# semantic-search Specification

## Purpose

Build-time curriculum embeddings and runtime hybrid search for TypeScript School.

## Requirements

### Requirement: Curriculum search index is generated at build time

The build MUST produce Neptune-compatible `public/search/search-index.json` covering every registered lesson and supporting page entry derived from curriculum/nav.

#### Scenario: Index includes a lesson

- **GIVEN** a registered lesson with id `truthiness-narrowing`
- **WHEN** the search index is generated
- **THEN** a document with that id exists with route, keywords, and bodyText

### Requirement: Global search uses hybrid Neptune with fuzzy fallback

The search store MUST query Neptune hybrid mode when semantic is ready, and MUST fall back to fuzzy-only otherwise.

#### Scenario: Fuzzy works before semantic ready

- **WHEN** the user opens search and types a known title fragment before MiniLM is ready
- **THEN** matching results still appear
