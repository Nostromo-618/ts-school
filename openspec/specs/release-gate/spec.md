# release-gate Specification

## Purpose
Release-readiness mechanics: licenses, third-party notices, stronger navbar frost, and a single automated gate that proves critical paths before treating the site as release-ready.
## Requirements
### Requirement: MIT license and third-party notices ship in-repo

The repository MUST include a root MIT `LICENSE` file and a `THIRD-PARTY-NOTICES.md` covering vd3/Open Color/Phosphor, LiteRT, Gemma model terms, and embedding-model attribution used for search index generation. README and About/Terms MUST link to them.

#### Scenario: License files exist
- **WHEN** a release gate runs
- **THEN** `LICENSE` and `THIRD-PARTY-NOTICES.md` are present at the repository root

### Requirement: Release gate script covers critical static and browser checks

The package MUST expose `pnpm gate:release` that runs lint, stylelint, format check, typecheck, unit tests, build, and Playwright Chromium Desktop plus a Chromium Mobile critical-path subset. Opt-in LLM e2e remains outside the required gate.

#### Scenario: Gate script is documented and runnable
- **WHEN** a maintainer runs `pnpm gate:release`
- **THEN** the listed checks execute in order and fail the gate on any failure

### Requirement: Navbar glass frost is strongly opaque

The primary navbar with glass styling MUST remain readable at the top of the page (not fully transparent) and MUST use a stronger frost opacity (approximately 0.88–0.92) when scrolled, via site CSS overrides of vd3 glass tokens without forking vd3.

#### Scenario: Top-of-page frost
- **WHEN** the learner views a page at scroll position 0
- **THEN** the fixed glass navbar is not fully transparent

### Requirement: CI runs Playwright Chromium Desktop

GitHub Actions CI on `main` MUST run Playwright Chromium Desktop e2e after build (in addition to existing lint/typecheck/unit/build), so release-critical browser flows are not local-only.

#### Scenario: CI includes e2e
- **WHEN** a pull request targets `main`
- **THEN** CI executes the Chromium Desktop Playwright suite

