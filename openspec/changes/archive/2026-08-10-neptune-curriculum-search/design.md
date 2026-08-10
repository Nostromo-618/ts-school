## Decisions

1. Index from typed Lesson modules via Vite SSR (same pattern as diagnostics).
2. Bundle Fuse via `loadFuse`; Transformers bundled with `loadTransformers` when semantic enabled.
3. Semantic degrade-to-fuzzy on failure.
4. Generated artifacts under `public/search/`.

## Non-Goals

- HTML crawl of prerendered pages
- Server RAG
