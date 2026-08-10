## Why

Semantic hybrid search fails under CSP because Transformers.js loads ORT WASM from jsDelivr. Mirror the LiteRT same-origin WASM pattern.

## What Changes

- Vite plugin serves/copies `@huggingface/transformers/dist` ORT assets at `/transformers-wasm/`
- Search store sets `env.backends.onnx.wasm.wasmPaths` and passes `onnxWasmPaths` to HybridSearch

## Capabilities

### Modified Capabilities

- `semantic-search`: CSP-safe ORT WASM for semantic warmup

## Impact

- Semantic search can initialize under `script-src 'self'`
- Fuzzy path unchanged

## Non-goals

- Widening CSP script-src for CDNs
- Changing school-tools fuzzy-only search
