## ADDED Requirements

### Requirement: Same-origin ORT WASM for semantic search

The site MUST serve Transformers.js ONNX Runtime WASM assets from the same origin under `${BASE_URL}transformers-wasm/` and MUST configure HybridSearch / Transformers `env.backends.onnx.wasm.wasmPaths` to that path before semantic init. CSP `script-src` MUST remain `'self'` (plus `'wasm-unsafe-eval'`) without allowing jsDelivr script modules.

#### Scenario: semantic init uses self-hosted ORT
- **GIVEN** the search store constructs HybridSearch
- **WHEN** semantic warmup starts
- **THEN** ORT WASM loads from `${BASE_URL}transformers-wasm/` rather than cdn.jsdelivr.net
