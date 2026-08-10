# School model compare — findings

Generated: 2026-08-10T09:36:34.418Z

## Labs `vdl-model-eval` (live WebGPU)

Suite: branding / honesty / instruction-exact (`utils/model-eval-suite.json`).

| Model | Pass rate | Avg latency | Notes |
|-------|-----------|-------------|-------|
| **gemma-4-E2B-it-web** | **67% (2/3)** | ~8.1s | Failed exact “blue quiet river” (replied “Water flows gently”) |
| **gemma-4-E4B-it-web** | **100% (3/3)** | ~3.8s | All cases passed |

Source: Labs `data/model-eval-reports/latest/report.json` after `pnpm model-eval -- --models gemma-4-E2B-it-web,gemma-4-E4B-it-web`.

E4B shows a clear win on this small Labs quality suite (instruction-following + slightly lower avg latency once loaded). It does **not** by itself prove better school tutoring or tool JSON reliability.

## School tutoring suite (`pnpm models:compare`)

Cases: starter route → `why-types`, invent-lesson trap, curriculum tool XML intent.

### Fixtures

Fixture replies encode the acceptance bar (100% when grounded / tool XML is present in the scored string).

### gemma-4-E2B-it-web
- Status: ok
- Pass rate: 100% (3/3)
  - PASS `starter-where-to-begin` — cites why-types / first lesson; no invented curriculum hedge
  - PASS `invent-getting-started` — does not invent fake route; redirects or admits missing
  - PASS `tool-search-narrowing` — emits allowlisted curriculum tool call

### gemma-4-E4B-it-web
- Status: ok
- Pass rate: 100% (3/3)
  - PASS `starter-where-to-begin` — cites why-types / first lesson; no invented curriculum hedge
  - PASS `invent-getting-started` — does not invent fake route; redirects or admits missing
  - PASS `tool-search-narrowing` — emits allowlisted curriculum tool call

### Live (`pnpm models:compare:live`)

Base URL: `http://localhost:5175` (stable `vite preview`; Chrome channel — bundled Playwright headless_shell loads weights but stalls on decode).

Both models loaded from local `.models/` over WebGPU and answered the tutoring cases.

### gemma-4-E2B-it-web
- Status: ok
- Pass rate: 67% (2/3)
  - PASS `starter-where-to-begin` (4112ms) — cites why-types / first lesson; no invented curriculum hedge
  - PASS `invent-getting-started` (2023ms) — does not invent fake route; redirects or admits missing
  - FAIL `tool-search-narrowing` (2024ms) — no search_curriculum/get_lesson/navigate_lesson tool_call

### gemma-4-E4B-it-web
- Status: ok
- Pass rate: 67% (2/3)
  - PASS `starter-where-to-begin` (6174ms) — cites why-types / first lesson; no invented curriculum hedge
  - PASS `invent-getting-started` (4068ms) — does not invent fake route; redirects or admits missing
  - FAIL `tool-search-narrowing` (4068ms) — no search_curriculum/get_lesson/navigate_lesson tool_call

Note: the live tool case scores the **visible final assistant text**. After `generateWithTools`, tool XML is usually consumed inside the loop, so a correct prose answer (both models named “Truthiness narrowing”) still fails the fixture-style `tool_call` scorer. This is **not** an E4B tutoring win over E2B on the school suite (parity at 2/3).

## Recommendation

**Keep E2B as the Load default** (faster first download, OpenSpec requirement, validated school starter path). Live school suite shows **parity**, not an E4B win.

**Recommend E4B as Quality** in the picker for capable machines (≥8GB RAM / `navigator.deviceMemory` ≥ 8): Labs eval shows better instruction adherence at +~0.5GB. Do **not** auto-flip the default until school live compare shows a durable win and OpenSpec is updated deliberately.

UI copy labels E4B as “Quality (recommended if ≥8GB RAM)” and shows a capacity-aware hint under the select.
