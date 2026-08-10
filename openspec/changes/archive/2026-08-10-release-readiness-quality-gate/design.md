## Context

See proposal.md for motivation. The site already has a mandatory ToC gate, local Gemma AI chat with tool allowlists and edit Accept/Reject, build-time Strada diagnostics, CSP + bundle isolation tests, and Playwright suites that are mostly local-only. `content-quality-overhaul` exists as a proposal without tasks. Navbar glass comes from vd3 tokens (`--vd-glass-bg-opacity: .65`, transparent when not scrolled).

## Goals / Non-Goals

**Goals:**
- One OpenSpec change that finishes content waves and release pillars.
- AI risk gate patterned after the site ToC (versioned localStorage, Escape = decline).
- Critical-path test completeness + `gate:release` + CI Playwright.
- Stronger frost via CSS variables only.

**Non-Goals:**
- Forking or patching `@vanduo-oss/vd3`.
- Line-coverage thresholds.
- Shipping model weights in git.

## Decisions

1. **AI risk storage** — Separate key `ts-school-ai-risk-accepted` and version constant from site ToC so AI copy can bump independently.
2. **Modal placement** — Full overlay (`AiRiskGate`) when chat open is requested without acceptance; sidebar may open behind/disabled or wait until accept — prefer: request open → show modal → on accept set `aiChat.open` and enable; on decline leave closed.
3. **Content batch of 12** — Target intermediate lessons currently lacking quiz and exercise; prefer high-traffic tracks (types, functions, type-level, tooling). Exact IDs listed in tasks.md after inventory.
4. **Compat package naming** — Keep npm alias `typescript-strada`; lessons mention both the alias and Microsoft’s `@typescript/typescript6` story so learners are not confused.
5. **CI** — Install Playwright browsers in CI; run Chromium Desktop after build; mobile subset via project grep/tag in `gate:release`.
6. **Navbar** — Override `--vd-glass-bg-opacity` to ~0.9; force light frost background even when `:not(.vd-navbar-scrolled)`.

## Risks / Trade-offs

- [Large content wave] → Keep compiler-truth + diagnostics regenerate as hard gates; batch quizzes carefully.
- [CI time for Playwright] → Chromium Desktop only in CI; full matrix stays `test:e2e:full`.
- [Visual baseline churn from navbar] → Update snapshots in the same change.
- [AI modal fatigue] → Versioned once-per-version acceptance, not every open.

## Migration Plan

1. Land licenses + AI modal + CSS frost.
2. Content waves with regenerate diagnostics.
3. Tests + CI + README.
4. Archive completed sibling OpenSpec changes after merge readiness.
