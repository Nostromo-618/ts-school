# vanduo-oss dogfood report (ts-school)

**Consumer:** TypeScript School (`dev-v0.2.0`)  
**Date:** 2026-08-12  
**Packages dogfooded:** `@vanduo-oss/vd3`, `@vanduo-oss/vd3-cbun`, `@vanduo-oss/vdl-ai-chat`, `@vanduo-oss/vdl-hybrid-search`  
**Rule:** Real, evidence-backed items only. School-local policy/prompt fixes are not listed here.

Versions (from `package.json` at report time):
- `@vanduo-oss/vd3` `1.2.2`
- `@vanduo-oss/vd3-cbun` `1.3.1`
- `@vanduo-oss/vdl-ai-chat` `^0.1.0`
- `@vanduo-oss/vdl-hybrid-search` `^0.1.1`
- Adjacent: `@litert-lm/core` `0.15.0` (surfaced via `vdl-ai-chat` load path)

---

## 1. `vd3` — theme preference keys hardcoded to `vanduo-*`

| Field | Value |
|-------|--------|
| **Severity** | Medium (multi-app same-origin collision) |
| **Summary** | Theme / palette / radius / font preference keys are hardcoded with a `vanduo-` prefix; apps cannot pass a storage prefix. |
| **Evidence** | Documented in [README.md](../../../README.md) “Theme localStorage keys”; school remaps via [`src/lib/vd3-theme-storage.ts`](../../../src/lib/vd3-theme-storage.ts). |
| **Expected** | Optional `storagePrefix` (or similar) on theme defaults / `VanduoVue` so consumers choose `ts-school-*` without a remapper. |
| **Actual** | Keys always `vanduo-theme-preference`, `vanduo-palette`, etc. |
| **Suggested upstream fix** | Expose a documented storage-prefix option and keep current keys as default for back-compat. |
| **School workaround** | Remap + migrate on first load; Profile clear-all clears both namespaces. |

---

## 2. `vdl-ai-chat` (+ LiteRT adjacency) — E4B headless Chrome load fails mid-stream

| Field | Value |
|-------|--------|
| **Severity** | High for automation / CI live eval |
| **Summary** | Cold-loading `gemma-4-E4B-it-web` in **headless** Chrome reaches ~71% then fails with `JS Stream Error [TypeError]: network error`. Same weights load to Ready in **headed** Chrome. E2B headless load succeeds. |
| **Evidence** | [`raw/e4b-headless-cold-load.txt`](raw/e4b-headless-cold-load.txt); explore campaign [`FINDINGS.md`](FINDINGS.md) F1–F3; `models:compare:live` E4B Load failed when sharing GPU context with E2B (mitigated in school by fresh browser per model). |
| **Expected** | E4B loads under headless Chrome with WebGPU flags (same as E2B), or fails with a clear, actionable error (not a generic stream/network TypeError). |
| **Actual** | Progress UI shows Loading ~71% → Load failed; sidebar text includes `JS Stream Error [TypeError]: network error`. |
| **Suggested upstream fix** | Harden model fetch / Cache Storage / ReadableStream path for large `.litertlm` under headless Chrome; surface root cause (fetch abort, cache quota, WASM decode) in the progress/error API consumers already poll. If root cause is LiteRT-only, document headless limits and detect them early. |
| **School workaround** | Keep E2B as default; document headed-only for E4B live automation; `school-model-compare --live` launches a **fresh browser process per model**; `test:e2e:llm` uses `--workers=1`. |

---

## 3. `vdl-hybrid-search` — fuzzy “getting started” near-miss quality

| Field | Value |
|-------|--------|
| **Severity** | Medium (education / tutoring consumers) |
| **Summary** | Fuzzy search for onboarding phrases like “TypeScript getting started” can rank a real but wrong lesson (`installing-types` — “Getting types for your dependencies”) highly enough that a tool-using tutor affirms it. |
| **Evidence** | Ask explore F4 / SCENARIO_LOG `invent-getting-started` on E2B; school now post-filters starter-intent queries in [`src/ai/school-tools.ts`](../../../src/ai/school-tools.ts) `search_curriculum`. |
| **Expected** | Either lower confidence / optional intent hints for weak title matches, or documented guidance that consumers must post-filter onboarding queries. |
| **Actual** | Default fuzzy merge returns near-miss titles without a “weak match” signal strong enough for small models to reject. |
| **Suggested upstream fix** | Optional `minScore` / `titleExactBoost` / `weakMatch` flag on hit metadata so tutors can refuse soft matches without hardcoding title deny-lists. |
| **School workaround** | `isStarterIntentQuery` + empty hits + `suggestion: firstLesson` when no strong title match. |

---

## Out of scope / not filed

- **`vd3-cbun`:** No new dogfood defects identified in this campaign beyond normal consumption.
- School policy/prompt/context gaps (in-browser facts, JS-pane refusal copy, exercise scaffolding) — fixed in school, not package bugs.
- Policy-block automation hangs — addressed in school by pre-`validateLlmInput` before LiteRT and `ts-ai-bubble-text` on policy turns.
