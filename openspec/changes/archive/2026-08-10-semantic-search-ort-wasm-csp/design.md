## Context

Transformers.js defaults ORT `wasmPaths` to jsDelivr. ts-school CSP blocks that module script fetch.

## Goals / Non-Goals

**Goals:** Same-origin ORT WASM via Vite plugin + HybridSearch `onnxWasmPaths`.

**Non-Goals:** CDN script-src exceptions.

## Decisions

1. Mirror `vite.litert-wasm.ts` for Transformers dist ORT files only (`.mjs` + `.wasm`).
2. Set wasmPaths both in `loadTransformers` and via `onnxWasmPaths` (package applies before pipeline).

## Risks / Trade-offs

Plugin must throw at build if ORT files missing from the installed transformers version.

## Migration Plan

Rebuild hybrid-search (`file:`) then ts-school.

## Open Questions

- None.
