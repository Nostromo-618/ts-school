# Ask exploratory campaign — BASELINE

Campaign: `ask-explore-v0.2.0`  
Branch: `dev-v0.2.0` (forked from `main` @ `79a35a3`)  
Host: macOS M4, 24GB RAM (Chrome reports `navigator.deviceMemory=16`)  
Date: 2026-08-12  
Base URL: `http://localhost:5173` (Vite dev)

## Environment
- Both weights present under `.models/`:
  - `gemma-4-E2B-it-web` ~1.9GB
  - `gemma-4-E4B-it-web` ~2.8GB
- WebGPU available in Chrome (`navigator.gpu=true`)
- ToC version seeded: `4` (`ts-school-toc-accepted`)

## Fixture compare (`pnpm models:compare`)
Snapshot: [`raw/fixtures-report.json`](raw/fixtures-report.json), [`raw/fixtures-FINDINGS.md`](raw/fixtures-FINDINGS.md)

| Model | Status | Pass rate |
|-------|--------|-----------|
| E2B | ok | 100% (3/3) |
| E4B | ok | 100% (3/3) |

Fixture replies encode the acceptance bar (not live inference).

## Live compare (`pnpm models:compare:live`)
Snapshot: [`raw/live-compare.log`](raw/live-compare.log), [`raw/live-compare-report.json`](raw/live-compare-report.json)

| Model | Status | Pass rate | Notes |
|-------|--------|-----------|-------|
| E2B | ok | 67% (2/3) | FAIL `tool-search-narrowing` (no visible tool XML in final text — known scorer quirk) |
| E4B | **error** | n/a | Headless Chrome **Load failed** immediately after E2B session in same browser |

E2B live case notes (from log):
- PASS `starter-where-to-begin` (~4.1s)
- PASS `invent-getting-started` (~2.0s)
- FAIL `tool-search-narrowing` (~2.0s) — visible prose, not tool XML

## Headless E4B cold load (isolated)
[`raw/e4b-headless-cold-load.log`](raw/e4b-headless-cold-load.log)

- Fresh headless Chrome channel + WebGPU
- Progress reached **Loading 71%** then **Load failed**
- UI error text: `JS Stream Error [TypeError]: network error`
- **Headed** Chrome (Playwright MCP) loads the same E4B weights to **Ready** successfully

## Gated LLM e2e (`pnpm test:e2e:llm`)
Log: [`raw/e2e-llm.log`](raw/e2e-llm.log)

| Result | Detail |
|--------|--------|
| 2 passed | Markdown render + XSS escape (no LLM) |
| 1 failed | `local LLM starter chat` — status reached Loading 100% then **Load failed** (waited 10m for Ready). Against `vite preview :8787` after heavy prior WebGPU use. |

This does **not** prove E2B broken in general (dev `:5173` explore matrix loaded E2B successfully earlier). It does show gated LLM e2e is fragile under GPU contention / preview timing.

## Exploration harness artifacts
| File | Role |
|------|------|
| [`run-explore.mjs`](run-explore.mjs) | One-shot matrix runner (findings tooling) |
| [`raw/explore-results-e2b.json`](raw/explore-results-e2b.json) | Full E2B matrix (40 scenarios) |
| [`raw/explore-gemma-4-E2B-it-web.json`](raw/explore-gemma-4-E2B-it-web.json) | Per-model dump |
| [`raw/explore-e4b-manual.json`](raw/explore-e4b-manual.json) | Headed E4B scenario transcripts |
| [`raw/explore-e2b-rerun.log`](raw/explore-e2b-rerun.log) | E2B console log |
| [`raw/explore-run.log`](raw/explore-run.log) | First parallel attempt log |

## Baseline verdict
- Fixture harness green for both models.
- Live automation reliably exercises **E2B** in headless Chrome.
- **E4B cannot be trusted in headless Chrome** in this environment (stream/network error mid-load); headed Chrome works.
- Same-machine dual WebGPU sessions contend; after E2B headless work, headed E4B Ask can lose Ready / disable composer.
