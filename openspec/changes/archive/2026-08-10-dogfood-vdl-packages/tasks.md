## 1. Dependencies

- [x] 1.1 Switch package.json to vdl-ai-chat + vdl-hybrid-search file deps
- [x] 1.2 Update vite ssr.noExternal

## 2. Code

- [x] 2.1 NeptuneSearch → HybridSearch in search store and school-tools
- [x] 2.2 Repoint AiChat / guardrails / markdown imports
- [x] 2.3 Remove ambient vdl-engines declarations from env.d.ts

## 3. CI / docs

- [x] 3.1 Update ci.yml, pages.yml, update-visual-baselines.yml
- [x] 3.2 Update README prerequisite notes
- [x] 3.3 Update about.vue package list

## 4. Verify

- [x] 4.1 pnpm install + typecheck + unit tests
- [x] 4.2 openspec validate + archive
