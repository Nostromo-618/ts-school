## Why

Cmd+K substring search over titles cannot answer intent queries. Neptune hybrid search over a curriculum-built corpus unlocks synonym and semantic discovery while keeping search client-side.

## What Changes

- Build-time curriculum → Neptune `search-index.json` + `vectors.json`
- Replace substring search store with headless Neptune (bundled Fuse; optional semantic)
- CSP updates for embedding model fetches / workers when semantic is enabled
- Keep GlobalSearchModal UX (no v-html); show Fuzzy/Semantic source badges

## Capabilities

### New Capabilities

- `semantic-search`: Curriculum Neptune hybrid search pipeline and runtime.

### Modified Capabilities

- `docs-shell`: Global search uses hybrid Neptune results
- `e2e-coverage`: Search e2e covers hybrid/fuzzy path
- `repo-scaffold`: CSP allows opt-in AI/search hosts

## Impact

- Depends on `@vanduo-oss/vdl-engines` (file: until npm publish)
- Adds fuse.js + @huggingface/transformers (dev for indexer; fuse runtime)
- Does not restore in-browser tsc
