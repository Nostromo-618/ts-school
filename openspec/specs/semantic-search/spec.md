# semantic-search Specification

## Purpose
Curriculum hybrid search powered by the published
`@vanduo-oss/vdl-hybrid-search` package from npm, with same-origin ORT WASM
and host-provided loaders for CSP-safe semantic warmup.

## Requirements
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

### Requirement: Same-origin ORT WASM for semantic search

The site MUST serve Transformers.js ONNX Runtime WASM assets from the same origin under `${BASE_URL}transformers-wasm/` and MUST configure HybridSearch / Transformers `env.backends.onnx.wasm.wasmPaths` to that path before semantic init. CSP `script-src` MUST remain `'self'` (plus `'wasm-unsafe-eval'`) without allowing jsDelivr script modules.

#### Scenario: semantic init uses self-hosted ORT
- **GIVEN** the search store constructs HybridSearch
- **WHEN** semantic warmup starts
- **THEN** ORT WASM loads from `${BASE_URL}transformers-wasm/` rather than cdn.jsdelivr.net

### Requirement: HybridSearch resolves from the npm registry

The curriculum search dependency `@vanduo-oss/vdl-hybrid-search` MUST be
declared as a semver range against the public npm registry (at least `^0.1.1`)
and MUST NOT be installed via a `file:` path to a sibling clone. The search
store MUST continue to construct `HybridSearch` from that package.

#### Scenario: lockfile resolves registry package
- **GIVEN** a clean clone with no sibling VDL repositories
- **WHEN** dependencies are installed with the pinned pnpm toolchain
- **THEN** `@vanduo-oss/vdl-hybrid-search` resolves from the configured npm
  registry (not a `file:` directory link)

