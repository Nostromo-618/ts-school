# School model compare — findings

Generated: 2026-08-12T07:36:58.681Z

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

Fixture replies encode the acceptance bar (grounded answers / visible tool XML).

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

Base URL: `http://localhost:5173`

### gemma-4-E2B-it-web
- Status: ok
- Pass rate: 67% (2/3)
  - PASS `starter-where-to-begin` (4107ms) — cites why-types / first lesson; no invented curriculum hedge
  - PASS `invent-getting-started` (2046ms) — does not invent fake route; redirects or admits missing
  - FAIL `tool-search-narrowing` (2042ms) — no search_curriculum/get_lesson/navigate_lesson tool_call

### gemma-4-E4B-it-web
- Status: error
- Pass rate: n/a
- Error: Load failed: Ask TypeScript School
Load failed
Close
Model
Gemma 4 E2B (~2.0GB) — Fast (default)
Gemma 4 E4B (~2.5GB) — Quality (recommended if ≥8GB RAM)
Load model

Capable machine detected: E2B stays the default for a faster first load; switch to E4B for richer answers (+~0.5GB).

JS Stream Error [TypeError]: network error

Load Gemma 4 E2B/E4B locally, then ask about this lesson. Tools can search the curric

## Recommendation

**Keep E2B as the Load default** (faster first download, OpenSpec requirement, validated school starter path).

**Recommend E4B as Quality** in the picker for capable machines (≥8GB RAM). E4B live school data is incomplete — treat as Quality upgrade until a successful `--live` run exists for both models.

UI copy labels E4B as “Quality (recommended if ≥8GB RAM)” and shows a capacity-aware hint under the select.
