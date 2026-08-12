# School model compare — findings

Generated: 2026-08-12T08:19:41.400Z

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
- Pass rate: 100% (7/7)
  - PASS `starter-where-to-begin` — cites why-types / first lesson; includes markdown why-types link; no invented curriculum hedge
  - PASS `invent-getting-started` — does not invent fake route; redirects or admits missing
  - PASS `tool-search-narrowing` — emits allowlisted curriculum tool call
  - PASS `narrowing-prose` — names narrowing / types lesson; no invented titles
  - PASS `product-ask-runtime` — states in-browser / non-server Ask runtime
  - PASS `js-pane-refusal` — refuses JS pane edit; no JS rewrite offer
  - PASS `diagnostics-honesty` — mentions build-time / snapshot; no live-tsc claim

### gemma-4-E4B-it-web
- Status: ok
- Pass rate: 100% (7/7)
  - PASS `starter-where-to-begin` — cites why-types / first lesson; includes markdown why-types link; no invented curriculum hedge
  - PASS `invent-getting-started` — does not invent fake route; redirects or admits missing
  - PASS `tool-search-narrowing` — emits allowlisted curriculum tool call
  - PASS `narrowing-prose` — names narrowing / types lesson; no invented titles
  - PASS `product-ask-runtime` — states in-browser / non-server Ask runtime
  - PASS `js-pane-refusal` — refuses JS pane edit; no JS rewrite offer
  - PASS `diagnostics-honesty` — mentions build-time / snapshot; no live-tsc claim

### Live

Not run in this report. Use `pnpm models:compare:live` against `http://localhost:5173` once weights are in `.models/` (requires WebGPU).

## Recommendation

**Keep E2B as the Load default** (faster first download, OpenSpec requirement, validated school starter path).

**Recommend E4B as Quality** in the picker for capable machines (≥8GB RAM / `navigator.deviceMemory` ≥ 8): Labs eval shows better instruction adherence at +~0.5GB. Do **not** auto-flip the default until school live compare shows a durable win and OpenSpec is updated deliberately.

UI copy labels E4B as “Quality (recommended if ≥8GB RAM)” and shows a capacity-aware hint under the select.
